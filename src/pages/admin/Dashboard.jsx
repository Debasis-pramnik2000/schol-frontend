import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Badge } from 'react-bootstrap';
import { 
  FaUsers, 
  FaChalkboardTeacher, 
  FaSchool, 
  FaCalendarCheck,
  FaUserPlus,
  FaBell
} from 'react-icons/fa';
import { LineChart,  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import moment from 'moment';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  const statCards = [
    { 
      title: 'Total Students', 
      value: stats.totalStudents, 
      icon: <FaUsers />, 
      color: 'primary',
      link: '/admin/students'
    },
    { 
      title: 'Total Teachers', 
      value: stats.totalTeachers, 
      icon: <FaChalkboardTeacher />, 
      color: 'success',
      link: '/admin/teachers'
    },
    { 
      title: 'Total Classes', 
      value: stats.totalClasses, 
      icon: <FaSchool />, 
      color: 'info',
      link: '/admin/classes'
    },
    { 
      title: "Today's Attendance", 
      value: stats.todayAttendance, 
      icon: <FaCalendarCheck />, 
      color: 'warning',
      link: '/admin/attendance-reports'
    }
  ];

  return (
    <Container fluid className="py-4">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <div className="bg-primary text-white p-4 rounded-3">
            <h2 className="mb-0">Welcome, {user?.name}! 👋</h2>
            <p className="mb-0 opacity-75">
              Admin Dashboard - School Management Overview
            </p>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        {statCards.map((stat, index) => (
          <Col md={3} sm={6} key={index}>
            <Link to={stat.link} className="text-decoration-none">
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">{stat.title}</h6>
                      <h2 className="fw-bold">{stat.value}</h2>
                    </div>
                    <div className={`bg-${stat.color} bg-opacity-10 p-3 rounded-circle`}>
                      <span className={`text-${stat.color} fs-3`}>{stat.icon}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="fw-bold">
              Monthly Attendance Overview
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyAttendance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#28a745" name="Present" />
                  <Bar dataKey="absent" fill="#dc3545" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Recent Students */}
          <Card className="shadow-sm mb-3">
            <Card.Header className="fw-bold d-flex justify-content-between">
              <span><FaUserPlus className="me-2" />Recent Students</span>
              <Link to="/admin/students" className="text-decoration-none">View All</Link>
            </Card.Header>
            <Card.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {stats.recentStudents.map((student, index) => (
                <div key={index} className="d-flex align-items-center border-bottom py-2">
                  <img 
                    src={student.user?.profilePicture || 'https://via.placeholder.com/40'} 
                    alt={student.user?.name}
                    className="rounded-circle me-2"
                    width={40}
                    height={40}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-bold">{student.user?.name}</div>
                    <small className="text-muted">
                      {student.class}-{student.section} | {student.rollNumber}
                    </small>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>

          {/* Recent Notices */}
          <Card className="shadow-sm">
            <Card.Header className="fw-bold d-flex justify-content-between">
              <span><FaBell className="me-2" />Recent Notices</span>
              <Link to="/admin/notices" className="text-decoration-none">View All</Link>
            </Card.Header>
            <Card.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {stats.recentNotices.map((notice, index) => (
                <div key={index} className="border-bottom py-2">
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">{notice.title}</span>
                    <Badge bg={notice.priority === 'High' ? 'danger' : 'info'}>
                      {notice.priority}
                    </Badge>
                  </div>
                  <small className="text-muted">
                    {moment(notice.createdAt).fromNow()} by {notice.author?.name}
                  </small>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;