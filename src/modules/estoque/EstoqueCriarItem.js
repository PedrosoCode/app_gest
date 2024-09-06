import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

//TODO - Adicionar validação dos campos de entrada
//TODO - Permitir inserir categorias e fornecedores para o item
//REVIEW - Verificar uma forma de estilizar melhor o formulário
//TODO - Incluir imagem do item no cadastro

const EstoqueCriarItem = () => {
  const [formData, setFormData] = useState({
    nome_item: '',
    preco_base_venda: '',
    custo: ''
  });

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
      await axios.post('http://localhost:3042/api/item', {
        ...formData,
        codigo_empresa
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setFormData({
        nome_item: '',
        preco_base_venda: '',
        custo: ''
      });
    } catch (error) {
      console.error('Erro ao criar item de estoque:', error);
    }
  };

  return (
    <Container>
      <h2>Criar Item de Estoque</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Nome do Item</Form.Label>
          <Form.Control
            type="text"
            name="nome_item"
            value={formData.nome_item}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Preço Base de Venda</Form.Label>
          <Form.Control
            type="number"
            name="preco_base_venda"
            value={formData.preco_base_venda}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Custo</Form.Label>
          <Form.Control
            type="number"
            name="custo"
            value={formData.custo}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type="submit" className="mt-3">
          Criar
        </Button>
      </Form>
    </Container>
  );
};

export default EstoqueCriarItem;
