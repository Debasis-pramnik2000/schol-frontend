import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaBook, FaSchool } from 'react-icons/fa';

const Story = () => {
  return (
    <div className="about-page">
      {/* Header */}
      <div className="about-header">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="mb-2">
                <FaBook className="me-3" />
                Our Story
              </h1>
              <p className="mb-0 text-white-50">
                <FaSchool className="me-2" />
                Journey since 1968
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
          <Col lg={10} className="mx-auto">
            <Card className="shadow-sm border-0">
              <Card.Body className="p-5">
                <h2 className="mb-4 text-primary">
                  <FaSchool className="me-2" />
                  About Our School
                </h2>
                
                <p className="text-muted mb-4" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  <strong>Mansinghaberh Banishree Vidyaniketan (H.S.)</strong> was established 
                  in <strong>1968</strong> with a vision to provide quality education to students 
                  from the rural areas of Khejuri-II block in Purba Medinipur district. Over the 
                  past five decades, we have consistently maintained high standards of academic 
                  excellence and character development.
                </p>

                <p className="text-muted mb-4" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  Our institution is a <strong>Government Sponsored Co-educational Higher Secondary School</strong> 
                  affiliated with the <strong>West Bengal State Board</strong>. We offer education from 
                  <strong> Class V to Class XII</strong> in <strong>Bengali medium</strong>, ensuring that 
                  students from our rural community receive quality education close to home.
                </p>

                <p className="text-muted mb-4" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  With a dedicated team of <strong>14 experienced teachers</strong> and 
                  <strong> 12 well-equipped classrooms</strong>, we strive to nurture the intellectual, 
                  physical, and moral development of our <strong>691 students</strong>, preparing them 
                  for a bright and successful future.
                </p>

                <p className="text-muted mb-0" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  Our school has been a beacon of education in the region, serving multiple 
                  generations of families. Many of our alumni have gone on to achieve great 
                  success in various fields, contributing to society and the nation.
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

export default Story;