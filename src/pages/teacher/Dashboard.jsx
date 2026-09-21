import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Badge, Alert } from 'react-bootstrap';
import { FaChalkboardTeacher, FaUsers, FaClock, FaCalendarCheck, FaBook, FaBell } from 'react-icons/fa';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import moment from 'moment';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/teacher/dashboard');

      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load dashboard');
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container fluid className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!dashboardData) {
    return (
      <Container fluid className="py-4">
        <Alert variant="warning">No dashboard data available.</Alert>
      </Container>
    );
  }

  const {
    teacher = {},
    statistics = {},
    classes = [],
    todayTimetable = [],
    recentNotices = []
  } = dashboardData;

  const statCards = [
    {
      title: 'Total Classes',
      value: statistics.totalClasses || 0,
      icon: <FaChalkboardTeacher />,
      color: 'primary',
      link: '/teacher/classes'
    },
    {
      title: 'Total Students',
      value: statistics.totalStudents || 0,
      icon: <FaUsers />,
      color: 'success',
      link: '/teacher/students'
    },
    {
      title: "Today's Classes",
      value: statistics.todayClasses || 0,
      icon: <FaClock />,
      color: 'info',
      link: '/teacher/timetable'
    },
    {
      title: "Today's Attendance",
      value: statistics.todayAttendance || 0,
      icon: <FaCalendarCheck />,
      color: 'warning',
      link: '/teacher/attendance'
    }
  ];

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <h3 className="fw-bold mb-2">
                Welcome, {user?.name || teacher?.name || 'Teacher'}! 👨‍🏫
              </h3>
              <p className="text-muted mb-0">
                {teacher.qualification || 'Teacher'} | {teacher.specialization || 'General'} | ID: {teacher.employeeId || 'N/A'}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="mb-4">
        {statCards.map((stat, index) => (
          <Col md={3} sm={6} key={index} className="mb-3">
            <Link to={stat.link} className="text-decoration-none">
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted mb-2">{stat.title}</h6>
                      <h2 className="fw-bold mb-0">{stat.value}</h2>
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

      <Row>
        <Col lg={7}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="fw-bold">
              <FaClock className="me-2" />
              Today's Classes
            </Card.Header>
            <Card.Body>
              {todayTimetable && todayTimetable.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Class</th>
                        <th>Section</th>
                        <th>Subject</th>
                        <th>Time</th>
                        <th>Room</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayTimetable.map((item, index) => (
                        item.periods?.map((period, pIndex) => (
                          <tr key={`${index}-${pIndex}`}>
                            <td>{item.class}</td>
                            <td>{item.section}</td>
                            <td>{period.subject?.name || 'N/A'}</td>
                            <td>{period.startTime} - {period.endTime}</td>
                            <td>{period.room || 'TBA'}</td>
                          </tr>
                        ))
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted py-3 mb-0">No classes scheduled for today</p>
              )}
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header className="fw-bold d-flex justify-content-between align-items-center">
              <span>
                <FaChalkboardTeacher className="me-2" />
                My Classes
              </span>
              <Link to="/teacher/classes" className="text-decoration-none">View All</Link>
            </Card.Header>
            <Card.Body>
              {classes && classes.length > 0 ? (
                <Row>
                  {classes.map((cls) => (
                    <Col md={6} key={cls._id} className="mb-3">
                      <div className="border rounded p-3 h-100">
                        <h5 className="mb-3 fw-semibold">
                          {cls.className}-{cls.section}
                        </h5>
                        <small className="text-muted d-block mb-2">
                          <FaUsers className="me-2" />
                          {cls.studentCount || 0} Students
                        </small>
                        <small className="text-muted d-block">
                          <FaBook className="me-2" />
                          {cls.subjectCount || 0} Subjects
                        </small>
                        {cls.subjects && cls.subjects.length > 0 && (
                          <div className="mt-3">
                            <div className="small text-muted mb-2">Subjects:</div>
                            <div className="d-flex flex-wrap gap-1">
                              {cls.subjects.map((subject, index) => (
                                <Badge bg="light" text="dark" key={subject._id || subject.subject?._id || index}>
                                  {subject.subject?.name || subject.name || 'Subject'}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p className="text-center text-muted py-3 mb-0">No classes assigned</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="shadow-sm">
            <Card.Header className="fw-bold">
              <FaBell className="me-2" />
              Recent Notices
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {recentNotices && recentNotices.length > 0 ? (
                recentNotices.map((notice, index) => (
                  <div key={notice._id || index} className="border-bottom py-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <h6 className="mb-1">{notice.title}</h6>
                      <Badge bg={notice.priority === 'High' ? 'danger' : 'info'}>
                        {notice.priority || 'Normal'}
                      </Badge>
                    </div>
                    <p className="text-muted small mb-1">
                      {notice.content
                        ? notice.content.substring(0, 100) + (notice.content.length > 100 ? '...' : '')
                        : ''}
                    </p>
                    <small className="text-muted">
                      {notice.createdAt ? moment(notice.createdAt).fromNow() : ''}
                    </small>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted py-3 mb-0">No notices available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherDashboard;