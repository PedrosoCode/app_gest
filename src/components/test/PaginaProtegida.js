import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Container } from 'react-bootstrap';

const PaginaProtegida = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsuario(decodedToken);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
      }
    }
  }, []);

  return (
    <Container>
      <h2>Informações do Usuário</h2>
      {usuario ? (
        <>
          <p><strong>ID:</strong> {usuario.id}</p>
          <p><strong>Nome:</strong> {usuario.username}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Código da Empresa:</strong> {usuario.codigo_empresa}</p>
        </>
      ) : (
        <p>Carregando informações do usuário...</p>
      )}
    </Container>
  );
};

export default PaginaProtegida;
