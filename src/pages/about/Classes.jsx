import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaSchool } from 'react-icons/fa';

const Classes = () => {
  const classStrength = [
    { class: 'Class V', students: 76, color: 'primary' },
    { class: 'Class VI', students: 99, color: 'success' },
    { class: 'Class VII', students: 92, color: 'info' },
    { class: 'Class VIII', students: 105, color: 'warning' },
    { class: 'Class IX', students: 121, color: 'danger' },
    { class: 'Class X', students: 93, color: 'primary' },
    { class: 'Class XI', students: 64, color: 'success' },
    { class: 'Class XII', students: 41, color: 'info' }
  ];

  const totalStudents = classStrength.reduce((sum, c) => sum + c.students, 0);

  return (
    <div className="about-page">
      {/* Header */}
      <div className="about-header">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="mb-2">
                <FaUsers className="me-3" />
                Class-wise Student Strength
              </h1>
              <p className="mb-0 text-white-50">
                <FaSchool className="me-2" />
                Total Students: {totalStudents} | Classes: V to XII
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
        {/* Summary */}
        <Row className="mb-4">
          <Col md={6} className="mb-3">
            <Card className="text-center shadow-sm border-0 stat-card">
              <Card.Body>
                <FaUsers size={40} className="text-primary mb-2" />
                <h2 className="text-primary mb-1">{totalStudents}</h2>
                <p className="text-muted mb-0">Total Students</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="text-center shadow-sm border-0 stat-card">
              <Card.Body>
                <FaSchool size={40} className="text-success mb-2" />
                <h2 className="text-success mb-1">12</h2>
                <p className="text-muted mb-0">Classrooms</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Class Cards */}
        <Row>
          {classStrength.map((cls, index) => (
            <Col lg={3} md={4} sm={6} key={index} className="mb-4">
              <Card className={`text-center shadow-sm border-0 class-card border-${cls.color}`}>
                <Card.Body>
                  <h5 className={`text-${cls.color} mb-2`}>{cls.class}</h5>
                  <h2 className="mb-0 fw-bold">{cls.students}</h2>
                  <small className="text-muted">Students</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
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

export default Classes;