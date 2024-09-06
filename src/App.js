import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './modules/paginasCapa/Home';
import Sobre from './modules/paginasCapa/Sobre';

import CadBasListaAmbiente from './modules/cadastroBasico/ambientes/CadBasListaAmbiente';
import CadBasCriarAmbiente from './modules/cadastroBasico/ambientes/CadBasCriarAmbiente';
import CadBasAtualizarAmbiente from './modules/cadastroBasico/ambientes/CadBasAtualizarAmbiente';

import CadBasListaAtivo from './modules/cadastroBasico/ativos/CadBasListaAtivo';
import CadBasCriarAtivo from './modules/cadastroBasico/ativos/CadBasCriarAtivo';
import CadBasAtualizarAtivo from './modules/cadastroBasico/ativos/CadBasAtualizarAtivo';

import 'bootstrap/dist/css/bootstrap.min.css';
import ComponentMainNavbar from './components/ComponentMainNavbar';
import ContasLoginCadastroUsuario from './modules/Contas/ContasLoginCadastroUsuario';
import ContasCadastroEmpresa from './modules/Contas/ContasCadastroEmpresa';

import PaginaProtegida from './components/test/PaginaProtegida';
import RotaProtegida from './components/RotaProtegida';

import CadBasParceiroNegocioLista from './modules/cadastroBasico/parceiro_negocio/CadBasParceiroNegocioLista';
import CadBasParceiroNegocioCriar from './modules/cadastroBasico/parceiro_negocio/CadBasParceiroNegocioCriar';

import Teste from './modules/paginasCapa/Teste';
import EstoqueCriarItem from './modules/estoque/EstoqueCriarItem';
import CriarOrdemServico from './modules/ordemServico/CriarOrdemServico';

//TODO - Variável de ambiente para o link da API ao invés de setar fixo
//TODO - Feature de seleção de tabela de preços

const App = () => {
  return (
    <Router>
      <ComponentMainNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/teste" element={<Teste />} />
        <Route path="/ambientes" element={<CadBasListaAmbiente />} />
        <Route path="/ambientes/criar" element={<CadBasCriarAmbiente />} />
        <Route path="/ambientes/atualizar/:id" element={<CadBasAtualizarAmbiente />} />
        <Route path="/ativos" element={<CadBasListaAtivo />} />
        <Route path="/ativos/criar" element={<CadBasCriarAtivo />} />
        <Route path="/ativos/atualizar/:id" element={<CadBasAtualizarAtivo />} />
        <Route path="/contas-usuario" element={<ContasLoginCadastroUsuario />} />
        <Route path="/contas-empresa" element={<ContasCadastroEmpresa />} />
        <Route path="/protected" element={<RotaProtegida> <PaginaProtegida /> </RotaProtegida>} />
        <Route path="/parceiro-lista" element={<CadBasParceiroNegocioLista />} />
        <Route path="/parceiro-criar" element={<CadBasParceiroNegocioCriar />} />
        <Route path="/Estoque-criar-item" element={<EstoqueCriarItem />} />
        <Route path="/ordem-servico-criar" element={<CriarOrdemServico />} />
      </Routes>
    </Router>
  );
};

export default App;
