import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle, FaMapMarkerAlt, FaSchool } from 'react-icons/fa';

const SchoolInfo = () => {
  const schoolInfo = {
    name: 'Mansinghaberh Banishree Vidyaniketan (H.S.)',
    udiseCode: '19191304703',
    established: '1968',
    type: 'Co-educational',
    classes: 'V to XII',
    medium: 'Bengali',
    board: 'West Bengal State Board',
    management: 'Government Sponsored',
    area: 'Rural',
    village: 'Mansinghaberh',
    po: 'Pankhai',
    ps: 'Khejuri',
    block: 'Khejuri-II',
    district: 'Purba Medinipur',
    state: 'West Bengal',
    pincode: '721431'
  };

  return (
    <div className="about-page">
      {/* Header */}
      <div className="about-header">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="mb-2">
                <FaInfoCircle className="me-3" />
                School Information
              </h1>
              <p className="mb-0 text-white-50">
                <FaSchool className="me-2" />
                {schoolInfo.name}
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
          {/* Basic Details */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm border-0 h-100">
              <Card.Header className="bg-primary text-white">
                <FaInfoCircle className="me-2" />
                <strong>📋 Basic Details</strong>
              </Card.Header>
              <Card.Body>
                <InfoRow label="School Name" value={schoolInfo.name} />
                <InfoRow 
                  label="UDISE Code" 
                  value={<Badge bg="primary">{schoolInfo.udiseCode}</Badge>} 
                />
                <InfoRow label="Established" value={schoolInfo.established} />
                <InfoRow label="School Type" value={schoolInfo.type} />
                <InfoRow label="Classes" value={schoolInfo.classes} />
                <InfoRow label="Medium" value={schoolInfo.medium} />
                <InfoRow 
                  label="Board" 
                  value={<Badge bg="success">{schoolInfo.board}</Badge>} 
                />
                <InfoRow label="Management" value={schoolInfo.management} />
                <InfoRow label="Area" value={schoolInfo.area} />
              </Card.Body>
            </Card>
          </Col>

          {/* Location */}
          <Col lg={6} className="mb-4">
            <Card className="shadow-sm border-0 h-100">
              <Card.Header className="bg-success text-white">
                <FaMapMarkerAlt className="me-2" />
                <strong>📍 Location & Address</strong>
              </Card.Header>
              <Card.Body>
                <InfoRow label="Village" value={schoolInfo.village} />
                <InfoRow label="P.O." value={schoolInfo.po} />
                <InfoRow label="P.S." value={schoolInfo.ps} />
                <InfoRow label="Block" value={schoolInfo.block} />
                <InfoRow label="District" value={schoolInfo.district} />
                <InfoRow label="State" value={schoolInfo.state} />
                <InfoRow 
                  label="PIN Code" 
                  value={<Badge bg="info">{schoolInfo.pincode}</Badge>} 
                />
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

// Helper Component
const InfoRow = ({ label, value }) => (
  <Row className="mb-3">
    <Col md={5}><strong>{label}:</strong></Col>
    <Col md={7} className="text-muted">{value}</Col>
  </Row>
);

export default SchoolInfo;