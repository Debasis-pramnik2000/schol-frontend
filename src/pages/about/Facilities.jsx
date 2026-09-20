import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, FaBuilding, FaBookOpen, FaTint, 
  FaHandsWash, FaToilet, FaDesktop, FaSchool 
} from 'react-icons/fa';

const Facilities = () => {
  const facilities = [
    { icon: <FaBuilding />, name: '12 Classrooms', color: 'primary' },
    { icon: <FaBookOpen />, name: 'Library', color: 'success' },
    { icon: <FaTint />, name: 'Drinking Water', color: 'info' },
    { icon: <FaHandsWash />, name: 'Hand Washing', color: 'warning' },
    { icon: <FaToilet />, name: 'Boys Toilet', color: 'primary' },
    { icon: <FaToilet />, name: 'Girls Toilet', color: 'danger' },
    { icon: <FaToilet />, name: 'CWSN Toilet', color: 'success' },
    { icon: <FaDesktop />, name: 'Computer Facility', color: 'info' },
    { icon: <FaDesktop />, name: 'Digital Board', color: 'warning' },
    { icon: <FaBuilding />, name: 'Government Building', color: 'primary' },
    { icon: <FaBuilding />, name: 'Partial Boundary Wall', color: 'secondary' }
  ];

  return (
    <div className="about-page">
      {/* Header */}
      <div className="about-header">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="mb-2">
                <FaBuilding className="me-3" />
                School Facilities
              </h1>
              <p className="mb-0 text-white-50">
                <FaSchool className="me-2" />
                Our infrastructure and amenities
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
          {facilities.map((facility, index) => (
            <Col lg={3} md={4} sm={6} key={index} className="mb-4">
              <Card className="text-center shadow-sm border-0 h-100 facility-card">
                <Card.Body className="p-4">
                  <div className={`bg-${facility.color} bg-opacity-10 rounded-circle p-3 d-inline-block mb-3`}>
                    <span className={`text-${facility.color}`} style={{ fontSize: '32px' }}>
                      {facility.icon}
                    </span>
                  </div>
                  <h6 className="mb-0">{facility.name}</h6>
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

export default Facilities;