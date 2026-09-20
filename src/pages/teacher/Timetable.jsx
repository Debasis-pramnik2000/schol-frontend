import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Badge } from 'react-bootstrap';
import { FaClock } from 'react-icons/fa';
import axios from 'axios';

const TeacherTimetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/teacher/timetable');
      setTimetable(response.data.data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setError('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  const getDayTimetable = (day) => {
    return timetable.find(item => item.day === day);
  };

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
        <Col>
          <h2 className="mb-4">My Timetable</h2>

          {/* Day selector */}
          <div className="d-flex gap-2 mb-4 flex-wrap">
            {days.map(day => {
              const hasClass = getDayTimetable(day)?.periods?.some(p => p.teacher?._id);
              return (
                <Badge
                  key={day}
                  bg={selectedDay === day ? 'primary' : hasClass ? 'success' : 'secondary'}
                  className="p-2 px-3"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedDay(selectedDay === day ? '' : day)}
                >
                  <FaClock className="me-1" />
                  {day}
                  {hasClass && <span className="ms-1">●</span>}
                </Badge>
              );
            })}
          </div>

          {selectedDay ? (
            // Day-wise view
            (() => {
              const dayData = getDayTimetable(selectedDay);
              if (!dayData || !dayData.periods || dayData.periods.length === 0) {
                return (
                  <Card className="shadow-sm">
                    <Card.Body className="text-center py-5">
                      <p className="text-muted">No classes on {selectedDay}</p>
                    </Card.Body>
                  </Card>
                );
              }

              const teacherPeriods = dayData.periods.filter(p => p.teacher?._id);
              
              return (
                <Card className="shadow-sm">
                  <Card.Header className="fw-bold bg-primary text-white">
                    {selectedDay} - Schedule
                  </Card.Header>
                  <Card.Body>
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>Period</th>
                          <th>Class</th>
                          <th>Section</th>
                          <th>Subject</th>
                          <th>Time</th>
                          <th>Room</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teacherPeriods.map((period, index) => (
                          <tr key={index}>
                            <td>{period.periodNumber}</td>
                            <td>{dayData.class}</td>
                            <td>{dayData.section}</td>
                            <td>{period.subject?.name || 'N/A'}</td>
                            <td>{period.startTime} - {period.endTime}</td>
                            <td>{period.room || 'TBA'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              );
            })()
          ) : (
            // Weekly view
            <Row>
              {days.map(day => {
                const dayData = getDayTimetable(day);
                const periods = dayData?.periods?.filter(p => p.teacher?._id) || [];

                return (
                  <Col md={6} lg={4} key={day}>
                    <Card className="shadow-sm mb-4">
                      <Card.Header className={`fw-bold ${periods.length > 0 ? 'bg-success text-white' : 'bg-light'}`}>
                        {day}
                        {periods.length > 0 && (
                          <Badge bg="light" text="dark" className="ms-2">
                            {periods.length} Classes
                          </Badge>
                        )}
                      </Card.Header>
                      <Card.Body>
                        {periods.length > 0 ? (
                          <div>
                            {periods.map((period, index) => (
                              <div key={index} className="border-bottom py-2">
                                <div className="d-flex justify-content-between">
                                  <span className="fw-bold">Period {period.periodNumber}</span>
                                  <small className="text-muted">{period.startTime} - {period.endTime}</small>
                                </div>
                                <div className="small">
                                  <div>{period.subject?.name || 'N/A'}</div>
                                  <div className="text-muted">
                                    {dayData.class}-{dayData.section} | Room: {period.room || 'TBA'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-muted py-3 mb-0">
                            No classes
                          </p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherTimetable;