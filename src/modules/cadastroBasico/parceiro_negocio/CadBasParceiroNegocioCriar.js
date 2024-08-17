import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const CadBasParceiroNegocioCriar = () => {
  const [formData, setFormData] = useState({
    nome_razao_social: '',
    is_cnpj: 'true',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    email: '',
    tipo_parceiro: 'C',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/parceiros`, {
        ...formData, 
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      alert('Parceiro criado com sucesso!');
      setFormData({
        nome_razao_social: '',
        is_cnpj: 'true',
        documento: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        telefone: '',
        email: '',
        tipo_parceiro: 'C',
      });
    } catch (error) {
      console.error('Erro ao criar parceiro:', error);
      alert('Erro ao criar parceiro.');
    }
  };
  

  return (
    <Container><h2>Criar Parceiro de Negócio</h2><Form onSubmit={handleSubmit}><Form.Group><Form.Label>Nome / Razão Social</Form.Label><Form.Control
      type="text"
      name="nome_razao_social"
      value={formData.nome_razao_social}
      onChange={handleChange}
    /></Form.Group><Form.Group><Form.Label>Tipo de Documento</Form.Label><Form.Control
      as="select"
      name="is_cnpj"
      value={formData.is_cnpj}
      onChange={handleChange}
    ><option value="true">CNPJ</option><option value="false">CPF</option></Form.Control></Form.Group><Form.Group><Form.Label>Documento</Form.Label><Form.Control
      type="text"
      name="documento"
      value={formData.documento}
      onChange={handleChange}
    /></Form.Group><Form.Group><Form.Label>Endereço</Form.Label><Form.Control
      type="text"
      name="endereco"
      value={formData.endereco}
      onChange={handleChange}
    /></Form.Group><Form.Group><Form.Label>Cidade</Form.Label><Form.Control
      type="text"
      name="cidade"
      value={formData.cidade}
      onChange={handleChange}
    /></Form.Group><Form.Group><Form.Label>Estado</Form.Label><Form.Control
      type="text"
      name="estado"
      value={formData.estado}
      onChange={handleChange}
    /></Form.Group><Form.Group><Form.Label>CEP</Form.Label><Form.Control
      type="text"
      name="cep"
      value={formData.cep}
      onChange={handleChange}
    /></Form.Group><Form.Group><Form.Label>Telefone</Form.Label><Form.Control
      type="text"
      name="telefone"
      value={formData.telefone}
      onChange={handleChange}
    /></Form.Group><Form.Group><Form.Label>Email</Form.Label><Form.Control
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
    /></Form.Group><Form.Group><Form.Label>Selecione o Tipo de Parceiro</Form.Label><Form.Control
      as="select"
      name="tipo_parceiro"
      value={formData.tipo_parceiro}
      onChange={handleChange}
    ><option value="C">Cliente</option><option value="F">Fornecedor</option><option value="A">Ambos</option>
    </Form.Control></Form.Group><Form.Group>

      </Form.Group><Button type="submit" className="mt-3">
        Criar
      </Button></Form></Container>
  );
};

export default CadBasParceiroNegocioCriar;
