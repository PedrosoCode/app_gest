import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FaSearch } from 'react-icons/fa';
import './CadBasCriarAtivo.css';

//TODO - Separar a lógica da grid de parceiro de negócio em um componente separado para reutilização 
//REVIEW - Verificar uma forma de estilizar melhor a grid

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
    razao_social: ''
  });

  const [tecnicos, setTecnicos] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [parceiros, setParceiros] = useState([]);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    const fetchParceiros = async () => {
      try {
        const response = await axios.get('http://localhost:3042/api/parceiros');
        setParceiros(response.data);
      } catch (error) {
        console.error('Erro ao buscar parceiros de negócio:', error);
      }
    };
    fetchParceiros();
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

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    const decodedToken = jwtDecode(token);
    const codigo_empresa = decodedToken.codigo_empresa;

    try {
      await axios.post('http://localhost:3042/api/ativos', {
        ...formData,
        codigo_empresa
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setFormData({
        codigo_cliente: '',
        numero_serie: '',
        codigo_fabricante: '',
        modelo: '',
        codigo_prioridade: '',
        codigo_tecnico_responsavel: '',
        observacao: '',
        nivel_manutencao: false,
        razao_social: ''
      });
    } catch (error) {
      console.error('Erro ao criar ativo:', error);
    }
  };

  const onGridReady = params => {
    params.api.sizeColumnsToFit();
  };

  const handleRowSelection = (event) => {
    const selectedNode = event.api.getSelectedNodes()[0];
    if (selectedNode) {
      const selectedData = selectedNode.data;
      setFormData({
        ...formData,
        codigo_cliente: selectedData.codigo,
        razao_social: selectedData.nome_razao_social
      });
    }
    setShowModal(false);
  };

  const columnDefs = [
    { headerName: 'Código', field: 'codigo', checkboxSelection: true },
    { headerName: 'Razão Social', field: 'nome_razao_social', filter: 'agTextColumnFilter' },
    { headerName: 'Documento', field: 'documento' },
    { headerName: 'Cidade', field: 'cidade' }
  ];

  const localeText = {
    // Traduções de filtro
    filterOoo: 'Filtrar...',
    equals: 'Igual a',
    notEqual: 'Diferente de',
    contains: 'Contém',
    notContains: 'Não contém',
    startsWith: 'Começa com',
    endsWith: 'Termina com',
    // Outros textos
    loadingOoo: 'Carregando...',
    noRowsToShow: 'Nenhuma linha para mostrar',
    // Menu de colunas
    pinColumn: 'Fixar Coluna',
    valueAggregation: 'Agregação de Valor',
    autosizeThiscolumn: 'Autoajustar Esta Coluna',
    autosizeAllColumns: 'Autoajustar Todas as Colunas',
    resetColumns: 'Redefinir Colunas',
    expandAll: 'Expandir Tudo',
    collapseAll: 'Recolher Tudo',
    // Tool Panel
    toolPanel: 'Painel de Ferramentas',
    columns: 'Colunas',
    filters: 'Filtros',
    rowGroupColumnsEmptyMessage: 'Arraste colunas para agrupar',
    valueColumnsEmptyMessage: 'Arraste colunas para valores',
    pivotMode: 'Modo Pivô',
    groups: 'Grupos',
    values: 'Valores',
    pivots: 'Pivôs',
    // Outros textos de UI
    copy: 'Copiar',
    copyWithHeaders: 'Copiar com Cabeçalhos',
    ctrlC: 'Ctrl+C',
    paste: 'Colar',
    ctrlV: 'Ctrl+V',
  };

  return (
    <Container>
      <h2>Criar Ativo</h2>
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
            <Button onClick={() => setShowModal(true)} className="ml-2 d-flex align-items-center">
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
        <Button type="submit" className="mt-3">
          Criar
        </Button>
      </Form>

      {/* Modal com a ag-Grid para seleção do parceiro de negócio */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Selecionar Parceiro de Negócio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
            <AgGridReact
              rowSelection="single"
              onRowSelected={handleRowSelection}
              columnDefs={columnDefs}
              rowData={parceiros}
              onGridReady={onGridReady}
              localeText={localeText}
              defaultColDef={{
                flex: 1,
                minWidth: 100,
                filter: true,
                floatingFilter: true,
                resizable: true,
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CadBasCriarAtivo;
