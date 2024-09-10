import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { FaSearch } from 'react-icons/fa';
import CompGridClienteSelecao from '../../components/CompGridClienteSelecao';
import CompGridAtivoSelecao from '../../components/CompGridAtivoSelecao';

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

  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showAtivoModal, setShowAtivoModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    const decodedToken = jwtDecode(token);
    const codigo_empresa = decodedToken.codigo_empresa;

    try {
      await axios.post('http://localhost:3042/api/ordem-servico', {
        ...formData,
        codigo_empresa
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Limpa o formulário após o envio
      setFormData({
        codigo_cliente: '',
        codigo_ativo: '',
        observacao: '',
        razao_social: '',
        descricao_ativo: ''
      });
    } catch (error) {
      console.error('Erro ao criar ordem de serviço:', error);
    }
  };

  return (
    <Container>
      <h2>Criar Ordem de Serviço</h2>
      <Form onSubmit={handleSubmit}>
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

        <Button type="submit" className="mt-3">
          Criar Ordem de Serviço
        </Button>
      </Form>

      <CompGridClienteSelecao
        show={showClienteModal}
        onHide={() => setShowClienteModal(false)}
        onSelectCliente={(selectedData) => {
          setFormData({
            ...formData,
            codigo_cliente: selectedData.codigo,
            razao_social: selectedData.nome_razao_social
          });
          setShowClienteModal(false); // Fecha o modal após seleção
        }}
      />

      <CompGridAtivoSelecao
        show={showAtivoModal}
        onHide={() => setShowAtivoModal(false)}
        codigoCliente={formData.codigo_cliente} // Passa o código do cliente para o componente de seleção de ativos
        onSelectAtivo={(selectedData) => {
          setFormData({
            ...formData,
            codigo_ativo: selectedData.codigo,
            descricao_ativo: selectedData.modelo
          });
          setShowAtivoModal(false); // Fecha o modal após seleção
        }}
      />
    </Container>
  );
};

export default CriarOrdemServico;
