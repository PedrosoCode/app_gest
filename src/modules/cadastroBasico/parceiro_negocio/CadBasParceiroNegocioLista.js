import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//TODO - mudar o nome do botão "editar" para detalhes
//TODO - Na página detalhes, servirá tanto como exibição, como também edição

const API_URL = process.env.REACT_APP_API_URL;

const CadBasParceiroNegocioLista = () => {
  const [parceiros, setParceiros] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParceiros = async () => {
      try {
        const response = await axios.get(`${API_URL}/parceiros`);
        setParceiros(response.data);
      } catch (error) {
        console.error('Error fetching parceiros:', error);
      }
    };

    fetchParceiros();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Supondo que o token esteja armazenado no localStorage
      await axios.delete(`${API_URL}/parceiros/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setParceiros(parceiros.filter(parceiro => parceiro.codigo !== id));
    } catch (error) {
      console.error('Error deleting parceiro:', error);
    }
  };

  return (
    <Container>
      <h2>Lista de Parceiros de Negócio</h2>
      <Button onClick={() => navigate('/parceiros/criar')} className="mb-3">Cadastrar Novo Parceiro</Button>
      <ListGroup>
        {parceiros.map((parceiro) => (
          <ListGroup.Item key={parceiro.codigo}>
            {parceiro.nome_razao_social} - {parceiro.documento}
            <Button variant="danger" onClick={() => handleDelete(parceiro.codigo)} className="float-end ms-2">Deletar</Button>
            <Button onClick={() => navigate(`/parceiros/editar/${parceiro.codigo}`)} className="float-end">Editar</Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default CadBasParceiroNegocioLista;
