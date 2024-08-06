import React, { useState, useEffect, useMemo } from 'react';
import { Container, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FaSearch } from 'react-icons/fa';

const FiltrarParceirosModal = ({ show, handleClose, onSelect }) => {
  const [parceiros, setParceiros] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:3042/api/parceiros');
      setParceiros(response.data);
    } catch (error) {
      console.error('Erro ao buscar parceiros:', error);
    }
  };

  useEffect(() => {
    if (show) {
      handleSearch();
    }
  }, [show]);

  const handleRowSelected = (event) => {
    if (event.node.selected) {
      onSelect(event.data.codigo, event.data.nome_razao_social);
      handleClose();
    }
  };

  const columnDefs = useMemo(() => [
    { headerName: 'Documento', field: 'documento', filter: 'agTextColumnFilter' },
    { headerName: 'Nome / Razão Social', field: 'nome_razao_social', filter: 'agTextColumnFilter' },
    { headerName: 'Estado', field: 'estado', filter: 'agTextColumnFilter' },
    { headerName: 'Contato', field: 'nome_contato', filter: 'agTextColumnFilter' },
    { headerName: 'Tipo Parceiro', field: 'tipo_parceiro', filter: 'agTextColumnFilter' },
    {
      headerName: 'Selecionar',
      field: 'codigo',
      checkboxSelection: true,
      headerCheckboxSelection: false,
      width: 50,
    },
  ], []);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Filtrar Parceiros de Negócio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={parceiros}
            columnDefs={columnDefs}
            rowSelection="single"
            onRowSelected={handleRowSelected}
            domLayout='autoHeight'
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Teste = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState({ codigo: null, nome: '' });

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSelectPartner = (codigo, nome) => {
    setSelectedPartner({ codigo, nome });
  };

  return (
    <Container>
      <h1>About Page</h1>
      <p>Learn more about us on this page.</p>
      <InputGroup className="mb-3">
        <Form.Control
          type="text"
          placeholder="Selecionar parceiro"
          value={selectedPartner.nome}
          readOnly
        />
        <Button variant="outline-secondary" onClick={handleOpenModal}>
          <FaSearch />
        </Button>
      </InputGroup>
      <FiltrarParceirosModal
        show={showModal}
        handleClose={handleCloseModal}
        onSelect={handleSelectPartner}
      />
      <Form>
        <input
          type="hidden"
          name="codigo_parceiro"
          value={selectedPartner.codigo || ''}
        />
      </Form>
    </Container>
  );
};

export default Teste;
