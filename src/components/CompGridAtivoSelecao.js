import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';

// TODO - Trocar link por variável de ambiente

const CompGridAtivoSelecao = ({ show, onHide, onSelectAtivo, codigoCliente }) => {
  const [ativos, setAtivos] = useState([]);

  const fetchAtivos = async (codigoCliente) => {
    if (!codigoCliente) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3042/api/ordem-servico/ativos/${codigoCliente}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Garante que o valor é um array, mesmo que a API não retorne um array
      const data = Array.isArray(response.data) ? response.data : [];
      setAtivos(data); // Atualiza a lista de ativos com um array
    } catch (error) {
      console.error('Erro ao buscar ativos:', error);
      setAtivos([]); // Garante que a lista será um array vazio em caso de erro
    }
  };

  // useEffect que dispara quando o codigoCliente ou o show mudam
  useEffect(() => {
    if (show && codigoCliente) {
      fetchAtivos(codigoCliente);
    }
  }, [codigoCliente, show]);

  const columnDefs = [
    { headerName: 'Código', field: 'codigo', checkboxSelection: true, width: 100 },
    { headerName: 'Número de Série', field: 'numero_serie', filter: 'agTextColumnFilter', width: 150 },
    { headerName: 'Modelo', field: 'modelo', filter: 'agTextColumnFilter', width: 150 },
    { headerName: 'Prioridade', field: 'codigo_prioridade', width: 120 },
    { headerName: 'Técnico Responsável', field: 'codigo_tecnico_responsavel', width: 180 },
    { headerName: 'Observação', field: 'observacao', width: 200 }
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    filter: true,
    floatingFilter: true,
    resizable: true,
  };

  const handleRowSelection = (event) => {
    const selectedNode = event.api.getSelectedNodes()[0];
    if (selectedNode) {
      const selectedData = selectedNode.data;
      onSelectAtivo(selectedData); // Chama a função passada pelo componente pai
    }
    onHide(); // Fecha o modal após a seleção
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="w-100 mw-100"
      style={{ maxWidth: '100%' }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Selecionar Ativo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
          <AgGridReact
            rowSelection="single"
            onRowSelected={handleRowSelection}
            columnDefs={columnDefs}
            rowData={ativos} // rowData será os ativos filtrados pelo cliente
            defaultColDef={defaultColDef}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CompGridAtivoSelecao;
