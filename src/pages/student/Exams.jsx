import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Table, Badge } from 'react-bootstrap';
import api from '../../services/api';
import moment from 'moment';

const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/student/exams');
      setExams(response.data.data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setError('Failed to load exam schedule');
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (exam) => {
    if (exam.published) return { text: 'Published', bg: 'success' };
    const d = new Date(exam.examDate);
    if (d < new Date()) return { text: 'Completed', bg: 'secondary' };
    return { text: 'Upcoming', bg: 'warning' };
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading exam schedule...</p>
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
        <Col lg={10} className="mx-auto">
          <h2 className="mb-4">Exam Schedule</h2>

          {exams.length > 0 ? (
            <Card className="shadow-sm">
              <Card.Body>
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Exam Name</th>
                        <th>Date</th>
                        <th>Subjects</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exams.map((exam, index) => {
                        const status = getStatus(exam);
                        return (
                          <tr key={exam._id || index}>
                            <td>{exam.examName}</td>
                            <td>{exam.examDate ? moment(exam.examDate).format('DD MMM YYYY') : 'N/A'}</td>
                            <td>
                              {(exam.subjects || []).map((s, idx) => (
                                <span key={idx}>
                                  {s.name}
                                  {idx < exam.subjects.length - 1 && ', '}
                                </span>
                              ))}
                            </td>
                            <td>
                              <Badge bg={status.bg}>{status.text}</Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <p className="text-muted">No upcoming exams scheduled</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StudentExams;