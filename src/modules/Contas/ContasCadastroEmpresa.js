import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Modal } from 'react-bootstrap';

const ContasCadastroEmpresa = () => {
  const [empresaData, setEmpresaData] = useState({
    nome_empresa: '',
    is_cnpj: true,
    documento: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: ''
  });
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmpresaData({ ...empresaData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('${process.env.REACT_APP_API_URL}/empresa', empresaData);
      setShowModal(true);
    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error.response ? error.response.data : 'Erro desconhecido');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <Container className="mt-5">
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de Empresa bem-sucedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>Empresa cadastrada com sucesso!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      <h2>Cadastrar Empresa</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome da Empresa</Form.Label>
          <Form.Control
            type="text"
            name="nome_empresa"
            value={empresaData.nome_empresa}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="É CNPJ?"
            name="is_cnpj"
            checked={empresaData.is_cnpj}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Documento</Form.Label>
          <Form.Control
            type="text"
            name="documento"
            value={empresaData.documento}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Endereço</Form.Label>
          <Form.Control
            type="text"
            name="endereco"
            value={empresaData.endereco}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Cidade</Form.Label>
          <Form.Control
            type="text"
            name="cidade"
            value={empresaData.cidade}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Estado</Form.Label>
          <Form.Control
            type="text"
            name="estado"
            value={empresaData.estado}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>CEP</Form.Label>
          <Form.Control
            type="text"
            name="cep"
            value={empresaData.cep}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            name="telefone"
            value={empresaData.telefone}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={empresaData.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type="submit" className="mt-3">Cadastrar</Button>
      </Form>
    </Container>
  );
};

export default ContasCadastroEmpresa;
