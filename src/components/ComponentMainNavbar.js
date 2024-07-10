import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function ComponentMainNavbar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">UpKeepify</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/sobre">
              <Nav.Link>Sobre</Nav.Link>
            </LinkContainer>
            <NavDropdown title="Cadastro Básico" id="basic-nav-dropdown">
              <LinkContainer to="/ambientes">
                <NavDropdown.Item>Lista de Ambientes</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/ambientes/criar">
                <NavDropdown.Item>Criar Ambiente</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/ativos">
                <NavDropdown.Item>Lista de Ativos</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/ativos/criar">
                <NavDropdown.Item>Criar Ativo</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/parceiro-lista">
                <NavDropdown.Item>Parceiros de Negócio</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            <NavDropdown title="Contas" id="account-nav-dropdown">
              <LinkContainer to="/contas-usuario">
                <NavDropdown.Item>Login/Cadastro Usuário</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/contas-empresa">
                <NavDropdown.Item>Cadastro Empresa</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            <LinkContainer to="/protected">
              <Nav.Link>Página Protegida</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ComponentMainNavbar;
