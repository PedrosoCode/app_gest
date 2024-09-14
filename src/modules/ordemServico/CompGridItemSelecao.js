import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const CompGridItemSelecao = ({ show, onHide, onSelectItem }) => {
  const [itens, setItens] = useState([]);

  const fetchItens = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    try {
      const response = await axios.get('http://localhost:3042/api/ordem-servico/listar-item', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = Array.isArray(response.data) ? response.data : [];
      setItens(data);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
      setItens([]);
    }
  };

  useEffect(() => {
    if (show) {
      fetchItens();
    }
  }, [show]);

  const columnDefs = [
    { headerName: 'Código', field: 'codigo', checkboxSelection: true, width: 100 },
    { headerName: 'Nome do Item', field: 'nome_item', filter: 'agTextColumnFilter', width: 150 },
    { headerName: 'Preço Base', field: 'preco_base_venda', filter: 'agNumberColumnFilter', width: 150 },
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
      onSelectItem(selectedData);
    }
    onHide();
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
        <Modal.Title>Selecionar Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
          <AgGridReact
            rowSelection="single"
            onRowSelected={handleRowSelection}
            columnDefs={columnDefs}
            rowData={itens}
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

export default CompGridItemSelecao;
