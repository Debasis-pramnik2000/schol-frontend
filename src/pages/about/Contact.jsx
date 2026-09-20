import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, FaPhone, FaEnvelope, 
  FaMapMarkerAlt, FaSchool 
} from 'react-icons/fa';

const Contact = () => {
  const contactInfo = {
    address: {
      village: 'Village Mansinghaberh',
      po: 'P.O. Pankhai',
      ps: 'P.S. Khejuri',
      block: 'Khejuri-II',
      district: 'Purba Medinipur',
      state: 'West Bengal',
      pincode: '721431'
    },
    phone: '9153845926',
    email: 'mansinghabarhbv2016@gmail.com'
  };

  return (
    <div className="about-page">
      {/* Header */}
      <div className="about-header">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="mb-2">
                <FaPhone className="me-3" />
                Contact Us
              </h1>
              <p className="mb-0 text-white-50">
                <FaSchool className="me-2" />
                Get in touch with us
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
          {/* Address */}
          <Col lg={4} className="mb-4">
            <Card className="shadow-sm border-0 h-100 text-center">
              <Card.Body className="p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle p-4 d-inline-block mb-3">
                  <FaMapMarkerAlt size={40} className="text-primary" />
                </div>
                <h4 className="mb-3">Address</h4>
                <p className="text-muted mb-0">
                  {contactInfo.address.village}<br />
                  {contactInfo.address.po}<br />
                  {contactInfo.address.ps}<br />
                  {contactInfo.address.block}<br />
                  {contactInfo.address.district}<br />
                  {contactInfo.address.state} - {contactInfo.address.pincode}
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Phone */}
          <Col lg={4} className="mb-4">
            <Card className="shadow-sm border-0 h-100 text-center">
              <Card.Body className="p-4">
                <div className="bg-success bg-opacity-10 rounded-circle p-4 d-inline-block mb-3">
                  <FaPhone size={40} className="text-success" />
                </div>
                <h4 className="mb-3">Phone</h4>
                <p className="text-muted mb-3">
                  <a 
                    href={`tel:${contactInfo.phone}`} 
                    className="text-decoration-none fs-5 fw-bold"
                  >
                    {contactInfo.phone}
                  </a>
                </p>
                <a href={`tel:${contactInfo.phone}`}>
                  <Button variant="success">
                    <FaPhone className="me-2" /> Call Now
                  </Button>
                </a>
              </Card.Body>
            </Card>
          </Col>

          {/* Email */}
          <Col lg={4} className="mb-4">
            <Card className="shadow-sm border-0 h-100 text-center">
              <Card.Body className="p-4">
                <div className="bg-info bg-opacity-10 rounded-circle p-4 d-inline-block mb-3">
                  <FaEnvelope size={40} className="text-info" />
                </div>
                <h4 className="mb-3">Email</h4>
                <p className="text-muted mb-3" style={{ wordBreak: 'break-all' }}>
                  <a 
                    href={`mailto:${contactInfo.email}`} 
                    className="text-decoration-none"
                  >
                    {contactInfo.email}
                  </a>
                </p>
                <a href={`mailto:${contactInfo.email}`}>
                  <Button variant="info">
                    <FaEnvelope className="me-2" /> Send Email
                  </Button>
                </a>
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

export default Contact;