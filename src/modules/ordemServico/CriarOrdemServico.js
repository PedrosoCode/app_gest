import React, { useState } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { FaSearch, FaPlus, FaTrash, FaPencilAlt } from 'react-icons/fa';
import { useTable } from 'react-table';
import CompGridClienteSelecao from '../../components/CompGridClienteSelecao';
import CompGridAtivoSelecao from '../../components/CompGridAtivoSelecao';
import CompGridItemSelecao from './CompGridItemSelecao';
import {jwtDecode} from 'jwt-decode';

//TODO - grid para inserção de itens na OS
//FIXME - Modal de seleção do ativo com base no codigo do parceiro de negócio ainda não está funcionando

const CriarOrdemServico = () => {
  const [formData, setFormData] = useState({
    codigo_cliente: '',
    codigo_ativo: '',
    observacao: '',
    razao_social: '',
    descricao_ativo: ''
  });

  const [itensSelecionados, setItensSelecionados] = useState([]); // Itens adicionados à grid
  const [editableItem, setEditableItem] = useState(null); // Item a ser editado no modal
  const [showEditModal, setShowEditModal] = useState(false); // Controle do modal de edição
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showAtivoModal, setShowAtivoModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);

  // Função para enviar a OS e itens
  const salvarOrdemServico = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    const decodedToken = jwtDecode(token);
    const codigo_empresa = decodedToken.codigo_empresa;
    const API_URL = process.env.REACT_APP_API_URL;
  
    try {
      // 1. Enviar a OS para o endpoint principal
     const response = await axios.post(`${API_URL}/ordem-servico/criar_os`, {
        ...formData,
        codigo_empresa
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { codigo_ordem_servico } = response.data; 

      // 2. Fazer um loop para enviar cada item da OS
      await Promise.all(
        itensSelecionados.map((item) =>
          axios.post(`${API_URL}/ordem-servico/criar_os/inserir_item`, {
            codigo_ordem_servico, 
            codigo_item: item.codigo,
            quantidade_item: item.quantidade,
            valor_unitario: item.valor_unitario
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        )
      );

      console.log('Ordem de Serviço e itens salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar Ordem de Serviço e itens:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectItem = (selectedItem) => {
    setItensSelecionados((prev) => [
      ...prev,
      {
        ...selectedItem,
        quantidade: 1,
        valor_unitario: selectedItem.preco_base_venda
      }
    ]);
    setShowItemModal(false);
  };

  const handleDeleteItem = (item) => {
    setItensSelecionados((prev) => prev.filter((i) => i.codigo !== item.codigo));
  };

  const handleEditRow = (item) => {
    setEditableItem(item); // Define o item a ser editado no modal
    setShowEditModal(true); // Abre o modal
  };

  const handleSaveChanges = () => {
    setItensSelecionados((prev) =>
      prev.map((item) =>
        item.codigo === editableItem.codigo ? editableItem : item
      )
    );
    setShowEditModal(false); // Fecha o modal após salvar
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Código',
        accessor: 'codigo',
        key: 'codigo'
      },
      {
        Header: 'Nome do Item',
        accessor: 'nome_item',
        key: 'nome_item'
      },
      {
        Header: 'Quantidade',
        accessor: 'quantidade',
        key: 'quantidade'
      },
      {
        Header: 'Valor Unitário',
        accessor: 'valor_unitario',
        key: 'valor_unitario'
      },
      {
        Header: 'Editar',
        Cell: ({ row }) => (
          <Button variant="warning" onClick={() => handleEditRow(row.original)}>
            <FaPencilAlt />
          </Button>
        ),
        key: 'edit'
      },
      {
        Header: 'Excluir',
        Cell: ({ row }) => (
          <Button variant="danger" onClick={() => handleDeleteItem(row.original)}>
            <FaTrash />
          </Button>
        ),
        key: 'delete'
      }
    ],
    [itensSelecionados]
  );

  const tableInstance = useTable({
    columns,
    data: itensSelecionados
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <Container>
      <h2>Criar Ordem de Serviço</h2>
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
          <FaPlus className="mr-1" />
          Adicionar Item
        </Button>
        <Button variant="success" className="mt-3 ml-3" onClick={salvarOrdemServico}>
          Salvar OS
        </Button>
      </Form>

      {/* Grid de Itens Selecionados usando React Table */}
      <table {...getTableProps()} className="table table-striped mt-4">
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <th key={j} {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell, j) => (
                  <td key={j} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal de Edição */}
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
          <Button variant="primary" onClick={handleSaveChanges}>
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
        onSelectItem={handleSelectItem}
      />
    </Container>
  );
};

export default CriarOrdemServico;
