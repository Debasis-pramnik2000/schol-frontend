import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Badge } from 'react-bootstrap';
import api from '../../services/api';
import moment from 'moment';
import { FaCalendarAlt, FaUser } from 'react-icons/fa';

const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/student/notices');
      setNotices(response.data.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setError('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'secondary',
      'Medium': 'info',
      'High': 'warning',
      'Urgent': 'danger'
    };
    return colors[priority] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading notices...</p>
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
        <Col lg={8} className="mx-auto">
          <h2 className="mb-4">School Notices</h2>
          
          {notices.length > 0 ? (
            notices.map((notice, index) => (
              <Card className="shadow-sm mb-4" key={index}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{notice.title}</h5>
                  <Badge bg={getPriorityColor(notice.priority)}>
                    {notice.priority}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <p className="card-text">{notice.content}</p>
                  
                  {notice.attachments && notice.attachments.length > 0 && (
                    <div className="mt-2">
                      <small className="text-muted">Attachments:</small>
                      <ul className="list-unstyled">
                        {notice.attachments.map((attachment, idx) => (
                          <li key={idx}>
                            <a href={attachment} target="_blank" rel="noopener noreferrer">
                              📎 {attachment.split('/').pop()}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card.Body>
                <Card.Footer className="bg-transparent">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <FaUser className="me-1" />
                      <small className="text-muted">{notice.author?.name || 'Unknown'}</small>
                    </div>
                    <div>
                      <FaCalendarAlt className="me-1" />
                      <small className="text-muted">
                        {moment(notice.createdAt).format('DD MMM YYYY, hh:mm A')}
                      </small>
                    </div>
                  </div>
                </Card.Footer>
              </Card>
            ))
          ) : (
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <p className="text-muted">No notices available</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StudentNotices;