// src/modulos/protegido/PaginaProtegida.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';

const PaginaProtegida = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:3042/api/autenticacao/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsuario(response.data);
        } catch (error) {
          console.error('Erro ao buscar usuário:', error);
        }
      }
    };
    fetchUsuario();
  }, []);

  return (
    <Container>
      <h2>Informações do Usuário</h2>
      {usuario ? (
        <>
          <p><strong>ID:</strong> {usuario.id}</p>
          <p><strong>Nome:</strong> {usuario.username}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
        </>
      ) : (
        <p>Carregando informações do usuário...</p>
      )}
    </Container>
  );
};

export default PaginaProtegida;
