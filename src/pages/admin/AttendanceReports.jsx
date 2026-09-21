import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Badge, Table, Alert } from 'react-bootstrap';
import { FaChartLine } from 'react-icons/fa';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import moment from 'moment';

const AdminAttendanceReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [classes, setClasses] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    class: '',
    section: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchClasses();
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/admin/classes');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.class) params.append('class', filters.class);
      if (filters.section) params.append('section', filters.section);
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);

      const response = await api.get(`/api/admin/attendance-reports?${params}`);
      setReportData(response.data.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Failed to load report');
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchReport();
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading report...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">Attendance Reports</h2>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Form onSubmit={handleApplyFilters}>
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Class</Form.Label>
                      <Form.Select
                        name="class"
                        value={filters.class}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Classes</option>
                        {classes.map(cls => (
                          <option key={cls._id} value={cls.className}>
                            {cls.className} - {cls.section}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Section</Form.Label>
                      <Form.Select
                        name="section"
                        value={filters.section}
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
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
                  <Col md={2}>
                    <Form.Group className="mb-3">
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
                  <Col md={3} className="d-flex align-items-end">
                    <Button type="submit" variant="primary" className="w-100">
                      <FaChartLine className="me-2" /> Generate Report
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {error && <Alert variant="danger">{error}</Alert>}

          {reportData && (
            <>
              <Row className="mb-4">
                <Col md={3}>
                  <Card className="text-center shadow-sm">
                    <Card.Body>
                      <h6 className="text-muted">Total Records</h6>
                      <h3>{reportData.summary.totalRecords}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center shadow-sm">
                    <Card.Body>
                      <h6 className="text-success">Present</h6>
                      <h3 className="text-success">{reportData.summary.presentRecords}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center shadow-sm">
                    <Card.Body>
                      <h6 className="text-danger">Absent</h6>
                      <h3 className="text-danger">{reportData.summary.absentRecords}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-center shadow-sm">
                    <Card.Body>
                      <h6 className="text-primary">Attendance %</h6>
                      <h3 className="text-primary">{reportData.summary.attendancePercentage}%</h3>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="shadow-sm mb-4">
                <Card.Header className="fw-bold">Daily Attendance Breakdown</Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.dailyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="#28a745" name="Present" />
                      <Bar dataKey="absent" fill="#dc3545" name="Absent" />
                      <Bar dataKey="late" fill="#ffc107" name="Late" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>

              <Card className="shadow-sm">
                <Card.Header className="fw-bold">Detailed Records</Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Student</th>
                          <th>Class</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Marked By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.records.map((record, index) => (
                          <tr key={record._id}>
                            <td>{index + 1}</td>
                            <td>{record.student?.rollNumber || 'N/A'}</td>
                            <td>{record.class}-{record.section}</td>
                            <td>{moment(record.date).format('DD MMM YYYY')}</td>
                            <td>
                              <Badge bg={
                                record.status === 'Present' ? 'success' :
                                record.status === 'Absent' ? 'danger' : 'warning'
                              }>
                                {record.status}
                              </Badge>
                            </td>
                            <td>{record.user?.name || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminAttendanceReports;