import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaSchool, FaArrowLeft, FaInfoCircle, FaUserTie,
  FaUsers, FaBuilding, FaBook, FaStar, FaPhone,
  FaArrowRight
} from 'react-icons/fa';

const About = () => {
  // ✅ Cards Data
  const cards = [
    {
      id: 1,
      icon: <FaInfoCircle />,
      title: 'School Information',
      description: 'Basic details, location and administration info',
      color: 'primary',
      link: '/about/school-info'
    },
    {
      id: 2,
      icon: <FaUserTie />,
      title: 'Our Faculty',
      description: 'Meet our 9 experienced teachers',
      color: 'success',
      link: '/about/teachers'
    },
    {
      id: 3,
      icon: <FaUsers />,
      title: 'Class Strength',
      description: 'Class-wise student distribution',
      color: 'info',
      link: '/about/classes'
    },
    {
      id: 4,
      icon: <FaBuilding />,
      title: 'Facilities',
      description: 'School infrastructure and amenities',
      color: 'warning',
      link: '/about/facilities'
    },
    {
      id: 5,
      icon: <FaBook />,
      title: 'Our Story',
      description: 'History and journey since 1968',
      color: 'secondary',
      link: '/about/story'
    },
    {
      id: 6,
      icon: <FaStar />,
      title: 'Vision & Mission',
      description: 'Our goals and objectives',
      color: 'danger',
      link: '/about/vision'
    },
    {
      id: 7,
      icon: <FaPhone />,
      title: 'Contact Us',
      description: 'Get in touch with us',
      color: 'primary',
      link: '/about/contact'
    }
  ];

  const schoolInfo = {
    name: 'Mansinghaberh Banishree Vidyaniketan (H.S.)',
    established: '1968',
    udiseCode: '19191304703'
  };

  return (
    <div className="about-page">
      {/* ==================== HEADER ==================== */}
      <div className="about-header">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="mb-2">
                <FaInfoCircle className="me-3" />
                About Our School
              </h1>
              <p className="mb-0 text-white-50">
                <FaSchool className="me-2" />
                {schoolInfo.name}
              </p>
              <p className="mb-0 text-white-50 small">
                Excellence in Education Since {schoolInfo.established}
              </p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Link to="/" className="btn btn-outline-light">
                <FaArrowLeft className="me-2" /> Back to Home
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        {/* ==================== WELCOME ==================== */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto text-center">
            <FaSchool size={60} className="text-primary mb-3" />
            <h2 className="mb-3">{schoolInfo.name}</h2>
            <p className="lead text-muted mb-3">
              A premier co-educational institution under West Bengal State Board, 
              committed to providing quality education since {schoolInfo.established}.
            </p>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <Badge bg="primary">UDISE: {schoolInfo.udiseCode}</Badge>
              <Badge bg="success">Established: {schoolInfo.established}</Badge>
              <Badge bg="info">Classes: V to XII</Badge>
            </div>
          </Col>
        </Row>

        {/* ==================== EXPLORE SECTION ==================== */}
        <Row className="mb-4">
          <Col className="text-center">
            <h3 className="mb-2">🎯 Explore About Us</h3>
            <p className="text-muted">Click on any card to see details</p>
          </Col>
        </Row>

        {/* ==================== CARDS GRID ==================== */}
        <Row>
          {cards.map((card) => (
            <Col lg={4} md={6} key={card.id} className="mb-4">
              <Link to={card.link} className="text-decoration-none">
                <Card className="about-card shadow-sm border-0 h-100">
                  <Card.Body className="text-center p-4">
                    <div 
                      className={`bg-${card.color} bg-opacity-10 rounded-circle p-3 d-inline-block mb-3`}
                      style={{ fontSize: '36px' }}
                    >
                      <span className={`text-${card.color}`}>
                        {card.icon}
                      </span>
                    </div>
                    <h5 className="mb-2">{card.title}</h5>
                    <p className="text-muted small mb-3">{card.description}</p>
                    <Button 
                      variant={`outline-${card.color}`} 
                      size="sm"
                      className="fw-bold"
                    >
                      View Details <FaArrowRight className="ms-1" />
                    </Button>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        {/* ==================== CTA ==================== */}
        <Row className="mt-5">
          <Col className="text-center">
            <Card className="bg-primary text-white shadow-sm border-0">
              <Card.Body className="py-4">
                <h3 className="mb-3">Ready to Join Us?</h3>
                <p className="mb-4">Start your journey towards excellence today.</p>
                <Link to="/apply-online">
                  <Button variant="light" size="lg" className="fw-bold text-primary">
                    📝 Apply Online
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;