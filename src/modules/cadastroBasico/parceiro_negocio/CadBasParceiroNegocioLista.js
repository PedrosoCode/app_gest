import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CadBasParceiroNegocioLista = () => {
  const [parceiros, setParceiros] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParceiros = async () => {
      try {
        const response = await axios.get('http://localhost:3042/api/parceiros');
        setParceiros(response.data);
      } catch (error) {
        console.error('Error fetching parceiros:', error);
      }
    };

    fetchParceiros();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3042/api/parceiros/${id}`);
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
