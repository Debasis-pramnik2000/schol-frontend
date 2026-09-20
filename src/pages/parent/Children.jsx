import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUser, FaCalendarCheck, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const ParentChildren = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await axios.get('/api/parent/children');
      setChildren(response.data.data);
    } catch (error) {
      console.error('Error fetching children:', error);
      setError('Failed to load children data');
      toast.error('Failed to load children data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading children...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">My Children</h2>
          
          {children.length > 0 ? (
            <Row>
              {children.map((child, index) => (
                <Col md={6} lg={4} key={index}>
                  <Card className="shadow-sm mb-4">
                    <Card.Body>
                      <div className="text-center mb-3">
                        <img 
                          src={child.user?.profilePicture || 'https://via.placeholder.com/100'} 
                          alt={child.user?.name}
                          className="rounded-circle"
                          width={100}
                          height={100}
                          style={{ objectFit: 'cover' }}
                        />
                        <h5 className="mt-2">{child.user?.name}</h5>
                        <Badge bg="info">
                          Class {child.class}-{child.section}
                        </Badge>
                        <p className="text-muted small">Roll: {child.rollNumber}</p>
                      </div>

                      <div className="d-grid gap-2">
                        <Link to={`/parent/attendance/${child._id}`}>
                          <Button variant="outline-primary" size="sm" className="w-100">
                            <FaCalendarCheck className="me-1" /> View Attendance
                          </Button>
                        </Link>
                        <Link to={`/parent/results/${child._id}`}>
                          <Button variant="outline-success" size="sm" className="w-100">
                            <FaChartLine className="me-1" /> View Results
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <p className="text-muted">No children found</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ParentChildren;