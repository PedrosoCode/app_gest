import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmpresaData({ ...empresaData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Adicione aqui a lógica para cadastrar a empresa, como uma chamada axios para sua API
    await axios.post('http://localhost:3042/api/empresa', empresaData);
    setEmpresaData({
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
  };

  return (
    <Container>
      <h2>Cadastrar Empresa</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Nome da Empresa</Form.Label>
          <Form.Control
            type="text"
            name="nome_empresa"
            value={empresaData.nome_empresa}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="É CNPJ?"
            name="is_cnpj"
            checked={empresaData.is_cnpj}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Documento</Form.Label>
          <Form.Control
            type="text"
            name="documento"
            value={empresaData.documento}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Endereço</Form.Label>
          <Form.Control
            type="text"
            name="endereco"
            value={empresaData.endereco}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Cidade</Form.Label>
          <Form.Control
            type="text"
            name="cidade"
            value={empresaData.cidade}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Estado</Form.Label>
          <Form.Control
            type="text"
            name="estado"
            value={empresaData.estado}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>CEP</Form.Label>
          <Form.Control
            type="text"
            name="cep"
            value={empresaData.cep}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            name="telefone"
            value={empresaData.telefone}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
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
