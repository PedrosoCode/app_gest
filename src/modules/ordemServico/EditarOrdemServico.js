import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { FaSearch, FaPlus, FaTrash, FaPencilAlt } from 'react-icons/fa';
import CompGridClienteSelecao from '../../components/CompGridClienteSelecao';
import CompGridAtivoSelecao from '../../components/CompGridAtivoSelecao';
import CompGridItemSelecao from './CompGridItemSelecao';
import {jwtDecode} from 'jwt-decode';
import { useParams } from 'react-router-dom';

const EditarOrdemServico = () => {
  const { id } = useParams(); // Recebe o id da OS a partir da URL
  const [formData, setFormData] = useState({
    codigo_cliente: '',
    codigo_ativo: '',
    observacao: '',
    razao_social: '',
    descricao_ativo: ''
  });
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [editableItem, setEditableItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showAtivoModal, setShowAtivoModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);

  // Função para carregar os dados da OS e preencher o formulário
  const carregarOrdemServico = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    const decodedToken = jwtDecode(token);
    const codigo_empresa = decodedToken.codigo_empresa;
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      // Requisição para buscar os dados da OS com base no id e no código_empresa
      const response = await axios.get(`${API_URL}/ordem-servico/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          codigo_empresa,  // Passa o codigo_empresa como query param
        },
      });

      const { codigo_cliente, codigo_ativo, observacao, razao_social, descricao_ativo, itens } = response.data;

      // Preenche o formulário com os dados da OS
      setFormData({
        codigo_cliente,
        codigo_ativo,
        observacao,
        razao_social,
        descricao_ativo
      });

      // Preenche os itens associados
      setItensSelecionados(itens);

    } catch (error) {
      console.error('Erro ao carregar OS:', error);
    }
  };

  useEffect(() => {
    carregarOrdemServico();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    const decodedToken = jwtDecode(token);
    const codigo_empresa = decodedToken.codigo_empresa;
    const API_URL = process.env.REACT_APP_API_URL;

    try {
      // Enviar as alterações da OS para o backend
      await axios.put(`${API_URL}/ordem-servico/${id}`, {
        ...formData,
        codigo_empresa
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Atualiza os itens da OS
      await Promise.all(
        itensSelecionados.map((item) =>
          axios.put(`${API_URL}/ordem-servico/item/${item.codigo}`, {
            codigo_ordem_servico: id, // Identifica a OS
            codigo_empresa,           // Identifica a empresa
            ...item
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        )
      );

      console.log('Ordem de Serviço e itens atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
    }
  };

  const handleEditRow = (item) => {
    setEditableItem(item);
    setShowEditModal(true);
  };

  const handleSaveItemChanges = () => {
    setItensSelecionados((prev) =>
      prev.map((item) => (item.codigo === editableItem.codigo ? editableItem : item))
    );
    setShowEditModal(false);
  };

  const handleDeleteItem = (item) => {
    setItensSelecionados((prev) => prev.filter((i) => i.codigo !== item.codigo));
  };

  return (
    <Container>
      <h2>Editar Ordem de Serviço</h2>
      <Form>
        <Form.Group>
          <Form.Label>Parceiro de Negócio (Cliente)</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              name="razao_social"
              value={formData.razao_social}
              readOnly
              style={{ flex: 1 }}
            />
            <Button onClick={() => setShowClienteModal(true)} className="ml-2 d-flex align-items-center">
              <FaSearch className="mr-1" />
              Buscar Parceiro
            </Button>
          </div>
        </Form.Group>

        <Form.Group>
          <Form.Label>Ativo</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              name="descricao_ativo"
              value={formData.descricao_ativo}
              readOnly
              style={{ flex: 1 }}
            />
            <Button onClick={() => setShowAtivoModal(true)} className="ml-2 d-flex align-items-center">
              <FaSearch className="mr-1" />
              Buscar Ativo
            </Button>
          </div>
        </Form.Group>

        <Form.Group>
          <Form.Label>Observação</Form.Label>
          <Form.Control
            type="text"
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" className="mt-3" onClick={() => setShowItemModal(true)}>
          <FaPlus className="mr-1" /> Adicionar Item
        </Button>

        <Button variant="success" className="mt-3 ml-3" onClick={handleSaveChanges}>
          Salvar Alterações
        </Button>
      </Form>

      {/* Grid de Itens Selecionados */}
      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome do Item</th>
            <th>Quantidade</th>
            <th>Valor Unitário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {itensSelecionados.map((item) => (
            <tr key={item.codigo}>
              <td>{item.codigo}</td>
              <td>{item.nome_item}</td>
              <td>{item.quantidade}</td>
              <td>{item.valor_unitario}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditRow(item)}>
                  <FaPencilAlt />
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteItem(item)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Edição de Itens */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editableItem && (
            <Form>
              <Form.Group>
                <Form.Label>Quantidade</Form.Label>
                <Form.Control
                  type="number"
                  value={editableItem.quantidade}
                  onChange={(e) =>
                    setEditableItem({
                      ...editableItem,
                      quantidade: e.target.value
                    })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Valor Unitário</Form.Label>
                <Form.Control
                  type="number"
                  value={editableItem.valor_unitario}
                  onChange={(e) =>
                    setEditableItem({
                      ...editableItem,
                      valor_unitario: e.target.value
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveItemChanges}>
            Salvar Alterações
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modais de Seleção de Cliente, Ativo e Itens */}
      <CompGridClienteSelecao
        show={showClienteModal}
        onHide={() => setShowClienteModal(false)}
        onSelectCliente={(selectedData) => {
          setFormData({
            ...formData,
            codigo_cliente: selectedData.codigo,
            razao_social: selectedData.nome_razao_social
          });
          setShowClienteModal(false);
        }}
      />

      <CompGridAtivoSelecao
        show={showAtivoModal}
        onHide={() => setShowAtivoModal(false)}
        codigoCliente={formData.codigo_cliente}
        onSelectAtivo={(selectedData) => {
          setFormData({
            ...formData,
            codigo_ativo: selectedData.codigo,
            descricao_ativo: selectedData.modelo
          });
          setShowAtivoModal(false);
        }}
      />

      <CompGridItemSelecao
        show={showItemModal}
        onHide={() => setShowItemModal(false)}
        onSelectItem={(selectedItem) => {
          setItensSelecionados((prev) => [
            ...prev,
            { ...selectedItem, quantidade: 1, valor_unitario: selectedItem.preco_base_venda }
          ]);
          setShowItemModal(false);
        }}
      />
    </Container>
  );
};

export default EditarOrdemServico;
