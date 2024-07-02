import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Tab, Nav, Form, Button, Modal } from 'react-bootstrap';

function ContasLoginCadastroUsuario() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignupModal, setShowSignupModal] = useState(false); // Estado para controlar a visibilidade do modal de signup
  const [showLoginModal, setShowLoginModal] = useState(false); // Estado para controlar a visibilidade do modal de login
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3042/api/auth/signup', {
        username, email, password
      });
      console.log('Resposta do cadastro:', response.data);
      setShowSignupModal(true); // Abrir o modal após o cadastro bem-sucedido
    } catch (error) {
      console.error('Erro ao cadastrar:', error.response ? error.response.data : 'Erro desconhecido');
    }
  };
  
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3042/api/auth/login', {
        email: username, // Passando 'username' como 'email' na requisição
        password
      });
      console.log('Resposta do login:', response.data);
      localStorage.setItem('token', response.data.token);
      setShowLoginModal(true); // Abrir o modal após o login bem-sucedido
    } catch (error) {
      console.error('Erro ao logar:', error.response ? error.response.data : 'Erro desconhecido');
    }
  };

  const handleCloseSignupModal = () => {
    setShowSignupModal(false);
    navigate('/'); // Redirecionar para a home após fechar o modal de signup
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    navigate('/'); // Redirecionar para a home após fechar o modal de login
  };

  return (
    <Container className="mt-5">
      {/* Modal de Feedback de Cadastro */}
      <Modal show={showSignupModal} onHide={handleCloseSignupModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro bem-sucedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>Conta criada com sucesso! Bem-vindo ao sistema.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSignupModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Feedback de Login */}
      <Modal show={showLoginModal} onHide={handleCloseLoginModal}>
        <Modal.Header closeButton>
          <Modal.Title>Login bem-sucedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>Você foi logado com sucesso! Bem-vindo ao sistema.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseLoginModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      <Tab.Container defaultActiveKey="signup">
        <Nav variant="pills" className="justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey="signup">Cadastrar-se</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="login">Login</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="signup">
            <Form onSubmit={handleSignup}>
              <Form.Group className="mb-3">
                <Form.Label>Nome de usuário</Form.Label>
                <Form.Control type="text" placeholder="Digite seu nome de usuário" value={username} onChange={(e) => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Digite seu email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" type="submit">Cadastrar-se</Button>
            </Form>
          </Tab.Pane>
          <Tab.Pane eventKey="login">
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Nome de usuário</Form.Label>
                <Form.Control type="text" placeholder="Digite seu nome de usuário ou email" value={username} onChange={(e) => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="primary" type="submit">Login</Button>
            </Form>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default ContasLoginCadastroUsuario;