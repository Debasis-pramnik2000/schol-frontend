import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  FaCalendarCheck, 
  FaBook, 
  FaChartLine,
  FaDownload
} from 'react-icons/fa';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/student/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError('Failed to load dashboard data');
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

  const { student, attendance, timetable } = dashboardData;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="bg-primary text-white p-4 rounded-3">
            <h2 className="mb-0">Welcome, {user?.name}! 👋</h2>
            <p className="mb-0 opacity-75">
              Class {student.class}-{student.section} | Roll No: {student.rollNumber}
            </p>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3} sm={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <FaCalendarCheck size={32} className="text-primary mb-2" />
              <h5>Today's Attendance</h5>
              <Badge 
                bg={attendance.today === 'Present' ? 'success' : 'warning'}
                className="fs-5"
              >
                {attendance.today || 'Not Marked'}
              </Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <FaChartLine size={32} className="text-success mb-2" />
              <h5>Attendance</h5>
              <h3 className="text-success">{attendance.attendancePercentage}%</h3>
              <small className="text-muted">
                {attendance.presentDays} Present / {attendance.totalDays} Days
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <FaBook size={32} className="text-info mb-2" />
              <h5>Today's Classes</h5>
              <h3>{timetable?.periods?.length || 0}</h3>
              <small className="text-muted">Subjects today</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Link to="/student/materials" className="text-decoration-none">
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="text-center">
                <FaDownload size={32} className="text-warning mb-2" />
                <h5>Study Materials</h5>
                <Badge bg="warning" className="fs-5 text-dark">
                  View All
                </Badge>
                <small className="text-muted d-block mt-1">
                  Click to view materials
                </small>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboard;