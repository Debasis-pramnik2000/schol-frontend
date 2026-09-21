import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Form, Spinner, Badge, Button 
} from 'react-bootstrap';
import { FaChartLine } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const TeacherAttendanceReport = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/teacher/classes');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async () => {
    if (!selectedClass) {
      toast.warning('Please select a class');
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(
        `/api/teacher/attendance/report/${selectedClass}?month=${filters.month}&year=${filters.year}`
      );
      setReportData(response.data.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to load report');
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

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setReportData(null);
  };

  useEffect(() => {
    if (selectedClass) {
      fetchReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, filters]);

  if (loading && classes.length === 0) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">Attendance Report</h2>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Select Class</Form.Label>
                    <Form.Select
                      value={selectedClass}
                      onChange={handleClassChange}
                    >
                      <option value="">Select a class...</option>
                      {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>
                          {cls.className} - Section {cls.section}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
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
                <Col md={3}>
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
                <Col md={2} className="d-flex align-items-end">
                  <Button variant="primary" onClick={fetchReport} className="w-100">
                    <FaChartLine className="me-1" /> Generate
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {reportData && (
            <>
              <Row className="mb-4">
                <Col md={4}>
                  <Card className="text-center shadow-sm">
                    <Card.Body>
                      <h6 className="text-muted">Total Students</h6>
                      <h3>{reportData.summary.totalStudents}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center shadow-sm">
                    <Card.Body>
                      <h6 className="text-muted">Total Days</h6>
                      <h3>{reportData.summary.totalDays}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="text-center shadow-sm">
                    <Card.Body>
                      <h6 className="text-muted">Average Attendance</h6>
                      <h3>
                        {reportData.studentReport.length > 0 
                          ? (reportData.studentReport.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / reportData.studentReport.length).toFixed(1)
                          : 0}%
                      </h3>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="shadow-sm">
                <Card.Header className="fw-bold">Student-wise Attendance</Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Roll No</th>
                          <th>Student Name</th>
                          <th>Present</th>
                          <th>Absent</th>
                          <th>Total</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.studentReport.map((student, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{student.student.rollNumber}</td>
                            <td>{student.student.name}</td>
                            <td className="text-success">{student.present}</td>
                            <td className="text-danger">{student.absent}</td>
                            <td>{student.total}</td>
                            <td>
                              <Badge bg={student.percentage >= 75 ? 'success' : student.percentage >= 50 ? 'warning' : 'danger'}>
                                {student.percentage}%
                              </Badge>
                            </td>
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

export default TeacherAttendanceReport;