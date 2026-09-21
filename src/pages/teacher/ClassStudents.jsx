import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Badge, Button } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../services/api';
import { useParams, Link } from 'react-router-dom';

const TeacherClassStudents = () => {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClassStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  const fetchClassStudents = async () => {
    try {
      const response = await api.get(`/api/teacher/classes/${classId}/students`);
      setClassData(response.data.data.class);
      setStudents(response.data.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading students...</p>
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <Link to="/teacher/classes" className="text-decoration-none">
                <Button variant="outline-secondary" size="sm">
                  <FaArrowLeft className="me-1" /> Back
                </Button>
              </Link>
              <h2 className="mt-2">
                {classData?.className} - Section {classData?.section}
              </h2>
              <p className="text-muted">Class Teacher: {classData?.classTeacher?.name}</p>
            </div>
            <div>
              <Badge bg="info" className="fs-6">
                Total Students: {students.length}
              </Badge>
            </div>
          </div>

          <Card className="shadow-sm">
            <Card.Body>
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student</th>
                      <th>Roll No</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Parent Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr key={student._id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={student.user?.profilePicture || 'https://via.placeholder.com/40'} 
                              alt={student.user?.name}
                              className="rounded-circle me-2"
                              width={40}
                              height={40}
                            />
                            <div>
                              <div className="fw-bold">{student.user?.name}</div>
                              <small className="text-muted">@{student.user?.username}</small>
                            </div>
                          </div>
                        </td>
                        <td>{student.rollNumber}</td>
                        <td>{student.user?.email}</td>
                        <td>{student.user?.phone || 'N/A'}</td>
                        <td>{student.parentName || 'N/A'}</td>
                        <td>
                          <Link to={`/teacher/marks/student/${student._id}`}>
                            <Button variant="outline-primary" size="sm">
                              View Marks
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherClassStudents;