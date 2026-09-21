import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Table } from 'react-bootstrap';
import api from '../../services/api';

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/student/timetable');
      setTimetable(response.data.data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setError('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading timetable...</p>
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
          <h2 className="mb-4">My Timetable</h2>
          
          <Card className="shadow-sm">
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>Period</th>
                      {days.map((day, index) => (
                        <th key={index}>{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((period) => (
                      <tr key={period}>
                        <td className="fw-bold">Period {period}</td>
                        {days.map((day, index) => {
                          const dayData = timetable.find(t => t.day === day);
                          const periodData = dayData?.periods.find(p => p.periodNumber === period);
                          return (
                            <td key={index}>
                              {periodData ? (
                                <div className="p-1">
                                  <div className="fw-bold">{periodData.subject}</div>
                                  <small className="text-muted">{periodData.teacher?.name || 'TBA'}</small>
                                  <br />
                                  <small className="text-muted">{periodData.room || 'TBA'}</small>
                                </div>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                          );
                        })}
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

export default StudentTimetable;