import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';

// TODO - Trocar link por variável de ambiente

const CompGridAtivoSelecao = ({ show, onHide, onSelectAtivo, codigoCliente }) => {
  const [ativos, setAtivos] = useState([]);

  useEffect(() => {
    // Só faz a requisição se houver um cliente selecionado
    const fetchAtivos = async () => {
      if (!codigoCliente) {
        setAtivos([]); // Limpa a lista se nenhum cliente for selecionado
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token não encontrado');
          return;
        }

        const response = await axios.get(`http://localhost:3042/api/ativos/${codigoCliente}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Verifica se a resposta é um array e define os ativos
        const data = Array.isArray(response.data) ? response.data : [];
        setAtivos(data);
      } catch (error) {
        console.error('Erro ao buscar ativos:', error);
        setAtivos([]); // Limpa a lista em caso de erro
      }
    };

    fetchAtivos();
  }, [codigoCliente]); // Recarrega os ativos sempre que o código do cliente mudar

  const handleRowSelection = (event) => {
    const selectedNode = event.api.getSelectedNodes()[0];
    if (selectedNode) {
      const selectedData = selectedNode.data;
      onSelectAtivo(selectedData); // Chama a função passada pelo componente pai
    }
    onHide(); // Fecha o modal após a seleção
  };

  const columnDefs = [
    { headerName: 'Código', field: 'codigo', checkboxSelection: true },
    { headerName: 'Número de Série', field: 'numero_serie', filter: 'agTextColumnFilter' },
    { headerName: 'Modelo', field: 'modelo', filter: 'agTextColumnFilter' },
    { headerName: 'Prioridade', field: 'codigo_prioridade' },
    { headerName: 'Técnico Responsável', field: 'codigo_tecnico_responsavel' },
    { headerName: 'Observação', field: 'observacao' }
  ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="w-100 mw-100" // Classe CSS para largura total
      style={{ maxWidth: '100%' }} // Estilo inline para garantir a largura total
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
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CompGridAtivoSelecao;
