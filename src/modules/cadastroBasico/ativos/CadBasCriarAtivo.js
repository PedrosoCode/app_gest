import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const CadBasCriarAtivo = () => {
  const [formData, setFormData] = useState({
    codigo_cliente: '',
    numero_serie: '',
    codigo_fabricante: '',
    modelo: '',
    codigo_prioridade: 0,
    codigo_tecnico_responsavel: '',
    observacao: '',
    nivel_manutencao: false,
    codigo_empresa: ''
  });

  const [tecnicos, setTecnicos] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const response = await axios.get('http://localhost:3042/api/tecnicos');
        setTecnicos(response.data);
      } catch (error) {
        console.error('Erro ao buscar técnicos:', error);
      }
    };
    fetchTecnicos();
  }, []);

  useEffect(() => {
    const fetchPrioridades = async () => {
      try {
        const response = await axios.get('http://localhost:3042/api/ativos-prioridade');
        setPrioridades(response.data);
      } catch (error) {
        console.error('Erro ao buscar prioridades:', error);
      }
    };
    fetchPrioridades();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3042/api/ativos', formData);
      setFormData({
        codigo_cliente: '',
        numero_serie: '',
        codigo_fabricante: '',
        modelo: '',
        codigo_prioridade: '',
        codigo_tecnico_responsavel: '',
        observacao: '',
        nivel_manutencao: false,
        codigo_empresa: ''
      });
    } catch (error) {
      console.error('Erro ao criar ativo:', error);
    }
  };

  return (
    <Container>
      <h2>Criar Ativo</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Código do Cliente</Form.Label>
          <Form.Control
            type="text"
            name="codigo_cliente"
            value={formData.codigo_cliente}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Número de Série</Form.Label>
          <Form.Control
            type="text"
            name="numero_serie"
            value={formData.numero_serie}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Código do Fabricante</Form.Label>
          <Form.Control
            type="text"
            name="codigo_fabricante"
            value={formData.codigo_fabricante}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Modelo</Form.Label>
          <Form.Control
            type="text"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Nível de Prioridade</Form.Label>
          <Form.Control
            as="select"
            name="codigo_prioridade"
            value={formData.codigo_prioridade}
            onChange={handleChange}
          >
            <option value="">Selecione o nível de prioridade</option>
            {prioridades.map((prioridade) => (
              <option key={prioridade.res_codigo} value={prioridade.res_codigo}>
                {prioridade.res_nivel}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Técnico Responsável</Form.Label>
          <Form.Control
            as="select"
            name="codigo_tecnico_responsavel"
            value={formData.codigo_tecnico_responsavel}
            onChange={handleChange}
          >
            <option value="">Selecione um técnico</option>
            {tecnicos.map((tecnico) => (
              <option key={tecnico.codigo} value={tecnico.codigo}>
                {tecnico.nome}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Observação</Form.Label>
          <Form.Control
            type="text"
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Manutenção Interna"
            name="nivel_manutencao"
            checked={formData.nivel_manutencao}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Código da Empresa</Form.Label>
          <Form.Control
            type="text"
            name="codigo_empresa"
            value={formData.codigo_empresa}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type="submit" className="mt-3">
          Criar
        </Button>
      </Form>
    </Container>
  );
};

export default CadBasCriarAtivo;
