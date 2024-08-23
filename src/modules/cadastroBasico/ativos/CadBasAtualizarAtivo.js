import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { FaSearch } from 'react-icons/fa';
import CompGridClienteSelecao from '../../../components/CompGridClienteSelecao'; // Importe o componente

const CadBasAtualizarAtivo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigo_cliente: '',
    numero_serie: '',
    codigo_fabricante: '',
    modelo: '',
    codigo_prioridade: '',
    codigo_tecnico_responsavel: '',
    observacao: '',
    nivel_manutencao: false,
    razao_social: '' // Campo para exibir o nome do cliente
  });
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [tecnicos, setTecnicos] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAtivo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token não encontrado');
          return;
        }

        const response = await axios.get(`http://localhost:3042/api/ativos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const ativo = response.data;

        const clienteResponse = await axios.get(`http://localhost:3042/api/parceiros/${ativo.codigo_cliente}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const cliente = clienteResponse.data;

        const fullData = {
          ...ativo,
          razao_social: cliente.nome_razao_social // Preencher a razão social do cliente
        };

        setFormData(fullData);
        setOriginalData(fullData); // Salva os dados originais
      } catch (error) {
        console.error('Erro ao buscar ativo:', error);
      }
    };

    fetchAtivo();
  }, [id]);

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
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const decodedToken = jwtDecode(token);
      const codigo_empresa = decodedToken.codigo_empresa;

      await axios.put(`http://localhost:3042/api/ativos/${id}`, {
        ...formData,
        codigo_empresa
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar ativo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      await axios.delete(`http://localhost:3042/api/ativos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/ativos');
    } catch (error) {
      console.error('Erro ao deletar ativo:', error);
    }
  };

  const handleCancel = () => {
    setFormData(originalData); // Restaura os dados originais
    setIsEditing(false); // Sai do modo de edição
  };

  const handleSelectCliente = (selectedData) => {
    setFormData({
      ...formData,
      codigo_cliente: selectedData.codigo,
      razao_social: selectedData.nome_razao_social // Preenche o campo de razão social
    });
  };

  return (
    <Container>
      <h2>Detalhes do Ativo</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Parceiro de Negócio (Cliente)</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              type="text"
              name="razao_social"
              value={formData.razao_social}
              readOnly
              style={{ flex: 1 }}
            />
            <Button 
              onClick={() => setShowModal(true)} 
              className="ml-2 d-flex align-items-center"
              disabled={!isEditing}
            >
              <FaSearch className="mr-1" />
              Buscar Parceiro
            </Button>
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Label>Número de Série</Form.Label>
          <Form.Control
            type="text"
            name="numero_serie"
            value={formData.numero_serie}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Código do Fabricante</Form.Label>
          <Form.Control
            type="text"
            name="codigo_fabricante"
            value={formData.codigo_fabricante}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Modelo</Form.Label>
          <Form.Control
            type="text"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Nível de Prioridade</Form.Label>
          <Form.Control
            as="select"
            name="codigo_prioridade"
            value={formData.codigo_prioridade}
            onChange={handleChange}
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            readOnly={!isEditing}
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Manutenção Interna"
            name="nivel_manutencao"
            checked={formData.nivel_manutencao}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </Form.Group>
        {isEditing ? (
          <>
            <Button type="submit" className="mt-3">
              Salvar
            </Button>
            <Button variant="secondary" className="mt-3 ms-3" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="danger" className="mt-3 ms-3" onClick={handleDelete}>
              Deletar
            </Button>
          </>
        ) : (
          <Button variant="primary" className="mt-3" onClick={() => setIsEditing(true)}>
            Atualizar
          </Button>
        )}
      </Form>

      {/* Usando o componente CompGridClienteSelecao */}
      <CompGridClienteSelecao
        show={showModal}
        onHide={() => setShowModal(false)}
        onSelectCliente={handleSelectCliente}
        isEditing={isEditing}
      />
    </Container>
  );
};

export default CadBasAtualizarAtivo;
