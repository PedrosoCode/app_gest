import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const CadBasCriarAmbiente = () => {
  const [nomeAmbiente, setNomeAmbiente] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3042/api/ambientes', { nome_ambiente: nomeAmbiente });
    setNomeAmbiente('');
  };

  return (
    <Container>
      <h2>Criar Ambiente</h2>
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
          Criar
        </Button>
      </Form>
    </Container>
  );
};

export default CadBasCriarAmbiente;
