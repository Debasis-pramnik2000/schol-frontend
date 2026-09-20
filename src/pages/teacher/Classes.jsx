import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Badge, Button } from 'react-bootstrap';
import { FaUsers, FaBook, FaUserTie, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/teacher/classes');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading classes...</p>
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
          <h2 className="mb-4">My Classes</h2>

          {classes.length > 0 ? (
            <Row>
              {classes.map((cls, index) => (
                <Col md={6} lg={4} key={index}>
                  <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white">
                      <h5 className="mb-0">
                        {cls.className} - Section {cls.section}
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-3">
                        <p className="mb-1">
                          <FaUserTie className="me-2 text-muted" />
                          <strong>Class Teacher:</strong> {cls.classTeacher?.name || 'Not Assigned'}
                        </p>
                        <p className="mb-1">
                          <FaUsers className="me-2 text-muted" />
                          <strong>Total Students:</strong> {cls.studentCount || 0}
                        </p>
                        <p className="mb-1">
                          <FaBook className="me-2 text-muted" />
                          <strong>Subjects:</strong> {cls.subjects?.length || 0}
                        </p>
                        <p className="mb-0">
                          <strong>Academic Year:</strong> {cls.academicYear}
                        </p>
                      </div>

                      <div className="d-grid gap-2">
                        <Link to={`/teacher/classes/${cls._id}/students`}>
                          <Button variant="outline-primary" size="sm" className="w-100">
                            <FaUsers className="me-1" /> View Students
                          </Button>
                        </Link>
                        <Link to={`/teacher/attendance/${cls._id}`}>
                          <Button variant="outline-success" size="sm" className="w-100">
                            <FaArrowRight className="me-1" /> Mark Attendance
                          </Button>
                        </Link>
                        <Link to={`/teacher/marks/${cls._id}`}>
                          <Button variant="outline-info" size="sm" className="w-100">
                            <FaBook className="me-1" /> Enter Marks
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-light">
                      <small className="text-muted">
                        Subjects: {cls.subjects?.map(s => s.subject?.name).join(', ') || 'None'}
                      </small>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <p className="text-muted">No classes assigned to you</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherClasses;