import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';

//TODO - Trocar link por variável de ambiente
//TODO - verificar uma forma de que o form que chama esse componente, especifique a procedure a ser usada

const CompGridClienteSelecao = ({ show, onHide, onSelectCliente, isEditing }) => {
  const [parceiros, setParceiros] = useState([]);

  useEffect(() => {
    const fetchParceiros = async () => {
      try {
        // Obtém o token JWT armazenado (geralmente no localStorage)
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('Token não encontrado');
          return;
        }
  
        // Faz a requisição com o token no cabeçalho Authorization
        const response = await axios.get('http://localhost:3042/api/parceiros', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        setParceiros(response.data);
      } catch (error) {
        console.error('Erro ao buscar parceiros de negócio:', error);
      }
    };
    fetchParceiros();
  }, []);

  const handleRowSelection = (event) => {
    const selectedNode = event.api.getSelectedNodes()[0];
    if (selectedNode) {
      const selectedData = selectedNode.data;
      onSelectCliente(selectedData); // Chama a função passada pelo componente pai
    }
    onHide(); // Fecha o modal após a seleção
  };

  const columnDefs = [
    { headerName: 'Código', field: 'codigo', checkboxSelection: true },
    { headerName: 'Razão Social', field: 'nome_razao_social', filter: 'agTextColumnFilter' },
    { headerName: 'Documento', field: 'documento' },
    { headerName: 'Cidade', field: 'cidade' }
  ];

  const localeText = {
    filterOoo: 'Filtrar...',
    equals: 'Igual a',
    notEqual: 'Diferente de',
    contains: 'Contém',
    notContains: 'Não contém',
    startsWith: 'Começa com',
    endsWith: 'Termina com',
    loadingOoo: 'Carregando...',
    noRowsToShow: 'Nenhuma linha para mostrar',
    pinColumn: 'Fixar Coluna',
    valueAggregation: 'Agregação de Valor',
    autosizeThiscolumn: 'Autoajustar Esta Coluna',
    autosizeAllColumns: 'Autoajustar Todas as Colunas',
    resetColumns: 'Redefinir Colunas',
    expandAll: 'Expandir Tudo',
    collapseAll: 'Recolher Tudo',
    toolPanel: 'Painel de Ferramentas',
    columns: 'Colunas',
    filters: 'Filtros',
    rowGroupColumnsEmptyMessage: 'Arraste colunas para agrupar',
    valueColumnsEmptyMessage: 'Arraste colunas para valores',
    pivotMode: 'Modo Pivô',
    groups: 'Grupos',
    values: 'Valores',
    pivots: 'Pivôs',
    copy: 'Copiar',
    copyWithHeaders: 'Copiar com Cabeçalhos',
    ctrlC: 'Ctrl+C',
    paste: 'Colar',
    ctrlV: 'Ctrl+V',
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="w-100 mw-100" // Classe CSS para largura total
      style={{ maxWidth: '100%' }} // Estilo inline para garantir a largura total
    >
      <Modal.Header closeButton>
        <Modal.Title>Selecionar Parceiro de Negócio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
          <AgGridReact
            rowSelection="single"
            onRowSelected={handleRowSelection}
            columnDefs={columnDefs}
            rowData={parceiros}
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
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CompGridClienteSelecao;
