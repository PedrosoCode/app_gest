import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CadBasAtualizarAmbiente = () => {
  const { id } = useParams();
  const [nomeAmbiente, setNomeAmbiente] = useState('');

  useEffect(() => {
    const fetchAmbiente = async () => {
      try {
        const response = await axios.get(`http://localhost:3042/api/ambientes/${id}`);
        setNomeAmbiente(response.data.nome_ambiente);
      } catch (error) {
        console.error('Error fetching ambiente:', error);
      }
    };

    fetchAmbiente();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:3042/api/ambientes/${id}`, { nome_ambiente: nomeAmbiente });
  };

  return (
    <Container>
      <h2>Atualizar Ambiente</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Nome do Ambiente</Form.Label>
          <Form.Control
            type="text"
            value={nomeAmbiente}
            onChange={(e) => setNomeAmbiente(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" className="mt-3">
          Atualizar
        </Button>
      </Form>
    </Container>
  );
};

export default CadBasAtualizarAmbiente;
