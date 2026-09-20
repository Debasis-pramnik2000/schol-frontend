import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaHeart, FaSchool } from 'react-icons/fa';

const Vision = () => {
  return (
    <div className="about-page">
      {/* Header */}
      <div className="about-header">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="mb-2">
                <FaStar className="me-3" />
                Vision & Mission
              </h1>
              <p className="mb-0 text-white-50">
                <FaSchool className="me-2" />
                Our goals and objectives
              </p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Link to="/about" className="btn btn-outline-light">
                <FaArrowLeft className="me-2" /> Back to About
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Row>
          {/* Vision */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-4 me-3">
                    <FaStar size={40} className="text-primary" />
                  </div>
                  <h2 className="mb-0">Our Vision</h2>
                </div>
                <p className="text-muted mb-0" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  To be a center of educational excellence in rural Bengal that empowers 
                  students to become lifelong learners, critical thinkers, and responsible 
                  citizens who contribute to society and the nation.
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Mission */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-success bg-opacity-10 rounded-circle p-4 me-3">
                    <FaHeart size={40} className="text-success" />
                  </div>
                  <h2 className="mb-0">Our Mission</h2>
                </div>
                <p className="text-muted mb-0" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  To provide holistic education in Bengali medium that combines academic 
                  excellence with character development, making quality education accessible 
                  to every student from our rural community.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-4">
          <Link to="/about">
            <Button variant="primary">
              <FaArrowLeft className="me-2" /> Back to About
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default Vision;