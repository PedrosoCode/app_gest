// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './modules/paginasCapa/Home';
import Sobre from './modules/paginasCapa/Sobre';

import CadBasListaAmbiente from './modules/cadastroBasico/ambientes/CadBasListaAmbiente';
import CadBasCriarAmbiente from './modules/cadastroBasico/ambientes/CadBasCriarAmbiente';
import CadBasAtualizarAmbiente from './modules/cadastroBasico/ambientes/CadBasAtualizarAmbiente';

import 'bootstrap/dist/css/bootstrap.min.css';
import ComponentMainNavbar from './components/ComponentMainNavbar';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/ambientes" element={<CadBasListaAmbiente />} />
        <Route path="/ambientes/criar" element={<CadBasCriarAmbiente />} />
        <Route path="/ambientes/atualizar/:id" element={<CadBasAtualizarAmbiente />} />
      </Routes>
    </Router>
  );
};

export default App;
