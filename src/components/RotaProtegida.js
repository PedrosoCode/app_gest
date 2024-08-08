import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const RotaProtegida = ({ children }) => {
  const token = localStorage.getItem('token');
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [estaCarregando, setEstaCarregando] = useState(true);

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:3042/api/autenticacao/verificarToken', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Token verificado com sucesso:', response.data); // Log para depuração
        setEstaAutenticado(true);
        setEstaCarregando(false);
      })
      .catch(error => {
        console.error('Erro ao verificar o token:', error.response ? error.response.data : 'Erro desconhecido');
        setEstaAutenticado(false);
        setEstaCarregando(false);
      });
    } else {
      setEstaCarregando(false);
    }
  }, [token]);

  if (estaCarregando) {
    return <div>Carregando...</div>;
  }

  if (!estaAutenticado) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RotaProtegida;
