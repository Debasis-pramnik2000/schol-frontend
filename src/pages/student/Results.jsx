import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import api from '../../services/api';

const StudentReportCard = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await api.get('/student/results');
      setResults(response.data.data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading results...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">My Results</h2>

          {results.length > 0 ? (
            results.map((result, index) => (
              <Card className="shadow-sm mb-4" key={index}>
                <Card.Header className="fw-bold bg-primary text-white d-flex justify-content-between">
                  <span>{result.examName}</span>
                  <Badge bg={result.published ? 'success' : 'warning'}>
                    {result.published ? 'Published' : 'Draft'}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Marks Obtained</th>
                          <th>Total Marks</th>
                          <th>Grade</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.subjects.map((subject, idx) => (
                          <tr key={idx}>
                            <td>{subject.name}</td>
                            <td>{subject.marksObtained}</td>
                            <td>{subject.totalMarks}</td>
                            <td>
                              <Badge bg={subject.grade === 'A' ? 'success' : 'warning'}>
                                {subject.grade}
                              </Badge>
                            </td>
                            <td>{subject.remarks || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="fw-bold">
                          <td colSpan="4" className="text-end">Total:</td>
                          <td>{result.totalMarks}</td>
                        </tr>
                        <tr className="fw-bold">
                          <td colSpan="4" className="text-end">Percentage:</td>
                          <td>{result.percentage}%</td>
                        </tr>
                        <tr className="fw-bold">
                          <td colSpan="4" className="text-end">Overall Grade:</td>
                          <td>
                            <Badge bg="success">{result.grade}</Badge>
                          </td>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <p className="text-muted">No results published yet</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StudentReportCard;