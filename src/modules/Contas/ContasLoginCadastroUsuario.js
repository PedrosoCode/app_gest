import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Tab, Nav, Form, Button, Modal } from 'react-bootstrap';

function ContasLoginCadastroUsuario() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [codigoEmpresa, setCodigoEmpresa] = useState('');
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/empresas`);
        setEmpresas(response.data);
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
      }
    };

    fetchEmpresas();
  }, [API_URL]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!codigoEmpresa) {
      setSignupError('Selecione uma empresa.');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        username, email, password, codigo_empresa: codigoEmpresa
      });
      console.log('Resposta do cadastro:', response.data);
      setShowSignupModal(true);
      setSignupError('');
    } catch (error) {
      console.error('Erro ao cadastrar:', error.response ? error.response.data : 'Erro desconhecido');
      setSignupError(error.response ? error.response.data : 'Erro desconhecido');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!codigoEmpresa) {
      setLoginError('Selecione uma empresa.');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: username,
        password,
        codigo_empresa: codigoEmpresa
      });
      console.log('Resposta do login:', response.data);
      localStorage.setItem('token', response.data.token);
      setShowLoginModal(true);
      setLoginError('');
    } catch (error) {
      console.error('Erro ao logar:', error.response ? error.response.data : 'Erro desconhecido');
      setLoginError(error.response ? error.response.data : 'Erro desconhecido');
    }
  };

  const handleCloseSignupModal = () => {
    setShowSignupModal(false);
    navigate('/');
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    navigate('/');
  };

  return (
    <Container className="mt-5">
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
              {signupError && <div className="alert alert-danger">{signupError}</div>}
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
              <Form.Group className="mb-3">
                <Form.Label>Empresa</Form.Label>
                <Form.Control as="select" value={codigoEmpresa} onChange={(e) => setCodigoEmpresa(e.target.value)}>
                  <option value="">Selecione a empresa</option>
                  {empresas.map((empresa) => (
                    <option key={empresa.codigo} value={empresa.codigo}>
                      {empresa.razao_social}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">Cadastrar-se</Button>
            </Form>
          </Tab.Pane>
          <Tab.Pane eventKey="login">
            <Form onSubmit={handleLogin}>
              {loginError && <div className="alert alert-danger">{loginError}</div>}
              <Form.Group className="mb-3">
                <Form.Label>Nome de usuário ou Email</Form.Label>
                <Form.Control type="text" placeholder="Digite seu nome de usuário ou email" value={username} onChange={(e) => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" placeholder="Digite sua senha" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Empresa</Form.Label>
                <Form.Control as="select" value={codigoEmpresa} onChange={(e) => setCodigoEmpresa(e.target.value)}>
                  <option value="">Selecione a empresa</option>
                  {empresas.map((empresa) => (
                    <option key={empresa.codigo} value={empresa.codigo}>
                      {empresa.razao_social}
                    </option>
                  ))}
                </Form.Control>
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
