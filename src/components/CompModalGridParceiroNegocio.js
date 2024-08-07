import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const FiltrarParceirosModal = ({ open, onClose, onSelect }) => {
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
    if (open) {
      handleSearch();
    }
  }, [open]);

  const columns = [
    { field: 'documento', headerName: 'Documento', width: 150 },
    { field: 'nome_razao_social', headerName: 'Nome / Razão Social', width: 200 },
    { field: 'estado', headerName: 'Estado', width: 100 },
    { field: 'nome_contato', headerName: 'Contato', width: 150 },
    { field: 'tipo_parceiro', headerName: 'Tipo Parceiro', width: 150 },
  ];

  const handleRowClick = (params) => {
    onSelect(params.row.codigo, params.row.nome_razao_social);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: 20, background: 'white', margin: 'auto', marginTop: 50, borderRadius: 8, width: '80%' }}>
        <h2>Filtrar Parceiros de Negócio</h2>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={parceiros}
            columns={columns}
            pageSize={5}
            getRowId={(row) => row.codigo}
            onRowClick={handleRowClick}
            checkboxSelection
            disableSelectionOnClick
          />
        </div>
        <Button variant="contained" color="secondary" onClick={onClose} style={{ marginTop: 10 }}>
          Fechar
        </Button>
      </div>
    </Modal>
  );
};

const CompModalGridParceiroNegocio = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState({ codigo: null, nome: '' });

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSelectPartner = (codigo, nome) => {
    setSelectedPartner({ codigo, nome });
    onSelect(codigo, nome);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Selecionar parceiro"
          value={selectedPartner.nome}
          variant="outlined"
          InputProps={{ readOnly: true }}
          style={{ flex: 1 }}
        />
        <IconButton onClick={handleOpenModal} color="primary">
          <SearchIcon />
        </IconButton>
      </div>
      <FiltrarParceirosModal
        open={open}
        onClose={handleCloseModal}
        onSelect={handleSelectPartner}
      />
    </>
  );
};

export default CompModalGridParceiroNegocio;
