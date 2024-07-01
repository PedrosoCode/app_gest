import React, { useEffect, useState } from 'react';
import { Container, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const CadBasListaAtivo = () => {
  const [ativos, setAtivos] = useState([]);

  useEffect(() => {
    const fetchAtivos = async () => {
      const response = await axios.get('http://localhost:3042/api/ativos');
      setAtivos(response.data);
    };

    fetchAtivos();
  }, []);


  //TODO - vincular fotos aos ativos
  //FIXME - atualizar o metodo de delete

  return (
    <Container>
      <h2>Lista de Ativos</h2>
      <ListGroup>
        {ativos.map((ativo) => (
          <ListGroup.Item key={ativo.codigo}>
            {ativo.numero_serie} - {ativo.modelo}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default CadBasListaAtivo;
