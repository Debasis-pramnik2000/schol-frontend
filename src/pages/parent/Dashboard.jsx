import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUsers, FaCalendarCheck, FaChartLine, FaBell, FaUserGraduate } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import moment from 'moment';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get('/api/parent/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard...</p>
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

  const { children, notices, totalChildren } = dashboardData;

  return (
    <Container fluid className="py-4">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <div className="bg-success text-white p-4 rounded-3">
            <h2 className="mb-0">Welcome, {user?.name}! 👨‍👩‍👧‍👦</h2>
            <p className="mb-0 opacity-75">
              You have {totalChildren} children in our school
            </p>
          </div>
        </Col>
      </Row>

      {/* Statistics */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FaUsers size={32} className="text-primary mb-2" />
              <h5>Total Children</h5>
              <h3>{totalChildren}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FaBell size={32} className="text-warning mb-2" />
              <h5>Notices</h5>
              <h3>{notices?.length || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FaChartLine size={32} className="text-success mb-2" />
              <h5>Children's Performance</h5>
              <Badge bg="success">View Details</Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Children List */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3">My Children</h4>
          <Row>
            {children?.map((child, index) => (
              <Col md={6} lg={4} key={index}>
                <Card className="shadow-sm mb-3">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <img 
                        src={child.user?.profilePicture || 'https://via.placeholder.com/50'} 
                        alt={child.user?.name}
                        className="rounded-circle me-3"
                        width={50}
                        height={50}
                      />
                      <div>
                        <h5 className="mb-0">{child.user?.name}</h5>
                        <small className="text-muted">
                          Class {child.class}-{child.section} | Roll: {child.rollNumber}
                        </small>
                      </div>
                    </div>

                    {/* Attendance Summary */}
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Attendance:</span>
                      <Badge bg={child.attendance?.percentage >= 75 ? 'success' : 'warning'}>
                        {child.attendance?.percentage || 0}%
                      </Badge>
                    </div>

                    <div className="d-flex justify-content-between">
                      <small className="text-muted">
                        Present: {child.attendance?.present || 0} / {child.attendance?.total || 0}
                      </small>
                    </div>

                    <hr />
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
        </Col>
      </Row>

      {/* Recent Notices */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="fw-bold">
              <FaBell className="me-2" />
              Recent Notices
            </Card.Header>
            <Card.Body>
              {notices?.length > 0 ? (
                notices.map((notice, index) => (
                  <div key={index} className="border-bottom py-2">
                    <div className="d-flex justify-content-between">
                      <h6 className="mb-1">{notice.title}</h6>
                      <Badge bg={notice.priority === 'High' ? 'danger' : 'info'}>
                        {notice.priority}
                      </Badge>
                    </div>
                    <p className="text-muted small mb-0">{notice.content.substring(0, 100)}...</p>
                    <small className="text-muted">
                      {moment(notice.createdAt).fromNow()}
                    </small>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted py-3">No notices available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ParentDashboard;