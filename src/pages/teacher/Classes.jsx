import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Badge } from 'react-bootstrap';
import { FaUsers, FaBook, FaUserTie } from 'react-icons/fa';
import api from '../../services/api';

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/teacher/classes');
      setClasses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError(error.response?.data?.message || 'Failed to load classes');
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
                <Col md={6} lg={4} key={cls._id || index}>
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
                          <strong>Class Teacher:</strong>{' '}
                          {cls.classTeacher?.name || 'Not Assigned'}
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
                          <strong>Academic Year:</strong> {cls.academicYear || 'N/A'}
                        </p>
                      </div>

                      {cls.subjects && cls.subjects.length > 0 && (
                        <div className="mb-3">
                          <div className="small text-muted mb-1">Subjects:</div>
                          <div className="d-flex flex-wrap gap-1">
                            {cls.subjects.map((s, i) => (
                              <Badge bg="light" text="dark" key={s._id || i}>
                                {s.name || s.subject?.name || 'Subject'}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <p className="text-muted mb-0">No classes assigned to you</p>
                <small className="text-muted">
                  Ask admin to assign you as class teacher or assign subjects to you.
                </small>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherClasses;