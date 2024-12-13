import React from 'react';
import { Col, Container, Row } from 'reactstrap';

const Footer = () => (
  <>
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col sm={6}>{new Date().getFullYear()} © WebNova.</Col>
          <Col sm={6}>
            <div className="text-sm-end d-none d-sm-block">Developed by WebNova</div>
          </Col>
        </Row>
      </Container>
    </footer>
  </>
);

export default Footer;
