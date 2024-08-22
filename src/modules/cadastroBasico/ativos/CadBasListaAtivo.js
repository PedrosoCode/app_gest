import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CadBasListaAtivo = () => {
  const [ativos, setAtivos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAtivos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token não encontrado');
          return;
        }

        const response = await axios.get('http://localhost:3042/api/ativos', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAtivos(response.data);
      } catch (error) {
        console.error('Erro ao buscar ativos:', error);
      }
    };

    fetchAtivos();
  }, []);

  return (
    <Container>
      <h2>Lista de Ativos</h2>
      <ListGroup>
        {ativos.map((ativo) => (
          <ListGroup.Item key={ativo.codigo}>
            {ativo.numero_serie} - {ativo.modelo}
            <Button variant="info" className="float-end" onClick={() => navigate(`/ativos/atualizar/${ativo.codigo}`)}>
              DETALHES
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default CadBasListaAtivo;
