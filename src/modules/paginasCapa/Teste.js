import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import CompModalGridParceiroNegocio from '../../components/CompModalGridParceiroNegocio';

const AboutPage = () => {
  const [selectedPartner, setSelectedPartner] = useState({ codigo: null, nome: '' });

  const handleSelectPartner = (codigo, nome) => {
    setSelectedPartner({ codigo, nome });
  };

  return (
    <Container>
      <h1>About Page</h1>
      <p>Learn more about us on this page.</p>
      <CompModalGridParceiroNegocio onSelect={handleSelectPartner} />
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

export default AboutPage;
