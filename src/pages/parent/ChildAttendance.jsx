import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert, Badge,Button,Form } from 'react-bootstrap';
import { FaArrowLeft, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

const ParentChildAttendance = () => {
  const { childId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchAttendance();
  }, [childId, filters]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/parent/attendance/${childId}?month=${filters.month}&year=${filters.year}`
      );
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError('Failed to load attendance data');
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: parseInt(e.target.value)
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Present': 'success',
      'Absent': 'danger',
      'Late': 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading attendance...</p>
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

  if (!data) {
    return (
      <Container className="py-5">
        <Alert variant="info">No attendance data found</Alert>
      </Container>
    );
  }

  const { student, attendance, summary } = data;

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          {/* Back Button */}
          <Link to="/parent/dashboard" className="text-decoration-none">
            <span className="btn btn-outline-secondary btn-sm mb-3">
              <FaArrowLeft className="me-1" /> Back to Dashboard
            </span>
          </Link>

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <div>
              <h2>Attendance Report</h2>
              <p className="text-muted">
                <FaUser className="me-1" />
                {student?.user?.name} ({student?.rollNumber}) - Class {student?.class}-{student?.section}
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Month</Form.Label>
                    <Form.Select
                      name="month"
                      value={filters.month}
                      onChange={handleFilterChange}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <option key={m} value={m}>
                          {moment().month(m - 1).format('MMMM')}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Year</Form.Label>
                    <Form.Select
                      name="year"
                      value={filters.year}
                      onChange={handleFilterChange}
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <Button variant="primary" onClick={fetchAttendance} className="w-100">
                    <FaCalendarAlt className="me-1" /> Apply Filter
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Summary Cards */}
          <Row className="mb-4">
            <Col md={3} sm={6}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-muted">Total Days</h6>
                  <h3>{summary.total}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-success">Present</h6>
                  <h3 className="text-success">{summary.present}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-danger">Absent</h6>
                  <h3 className="text-danger">{summary.absent}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-primary">Percentage</h6>
                  <h3 className="text-primary">{summary.percentage}%</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Attendance Table */}
          <Card className="shadow-sm">
            <Card.Header className="fw-bold">Attendance Records</Card.Header>
            <Card.Body>
              {attendance.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Check-in Time</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((record, index) => (
                        <tr key={record._id}>
                          <td>{index + 1}</td>
                          <td>{moment(record.date).format('DD MMM YYYY')}</td>
                          <td>{getStatusBadge(record.status)}</td>
                          <td>{record.checkInTime ? moment(record.checkInTime).format('hh:mm A') : 'N/A'}</td>
                          <td>{record.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-muted py-3">
                  No attendance records found for this period
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ParentChildAttendance;