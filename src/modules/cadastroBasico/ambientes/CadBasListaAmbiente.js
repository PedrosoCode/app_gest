import React, { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const CadBasListaAmbiente = () => {
  const [ambientes, setAmbientes] = useState([]);

  useEffect(() => {
    const fetchAmbientes = async () => {
      const response = await axios.get('http://localhost:3042/api/ambientes');
      setAmbientes(response.data);
    };

    fetchAmbientes();
  }, []);

  return (
    <Container>
      <h2>Lista de Ambientes</h2>
      <ListGroup>
        {ambientes.map((ambiente) => (
          <ListGroup.Item key={ambiente.id}>
            {ambiente.nome_ambiente}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default CadBasListaAmbiente;
