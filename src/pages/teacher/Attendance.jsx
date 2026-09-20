import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, Form, 
  Spinner, Badge 
} from 'react-bootstrap';
import { FaCheck, FaTimes, FaUser, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

const TeacherAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/teacher/classes');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (classId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/teacher/classes/${classId}/students`);
      // Initialize attendance data
      const initialData = response.data.data.students.map(student => ({
        studentId: student._id,
        name: student.user?.name,
        rollNumber: student.rollNumber,
        status: 'Present',
        remarks: ''
      }));
      setAttendanceData(initialData);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    if (classId) {
      fetchStudents(classId);
    } else {
      setAttendanceData([]);
    }
  };

  const handleStatusChange = (index, status) => {
    const updated = [...attendanceData];
    updated[index].status = status;
    setAttendanceData(updated);
  };

  const handleRemarksChange = (index, remarks) => {
    const updated = [...attendanceData];
    updated[index].remarks = remarks;
    setAttendanceData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const classData = classes.find(c => c._id === selectedClass);
      
      // Submit each student's attendance
      const promises = attendanceData.map(attendance => {
        return axios.post('/api/teacher/attendance', {
          studentId: attendance.studentId,
          class: classData.className,
          section: classData.section,
          status: attendance.status,
          remarks: attendance.remarks
        });
      });

      await Promise.all(promises);
      toast.success('Attendance marked successfully!');
      
      // Refresh data
      fetchStudents(selectedClass);
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

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
          <h2 className="mb-4">Mark Attendance</h2>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row>
                <Col md={6}>
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
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      <FaCalendarAlt className="me-1" /> Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      disabled
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {selectedClass && (
            <Card className="shadow-sm">
              <Card.Header className="fw-bold">
                <FaUser className="me-2" />
                Student List
                <Badge bg="info" className="ms-2">
                  {attendanceData.length} Students
                </Badge>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Roll No</th>
                          <th>Student Name</th>
                          <th>Status</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.map((data, index) => (
                          <tr key={data.studentId}>
                            <td>{index + 1}</td>
                            <td>{data.rollNumber}</td>
                            <td>{data.name}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button
                                  variant={data.status === 'Present' ? 'success' : 'outline-success'}
                                  size="sm"
                                  onClick={() => handleStatusChange(index, 'Present')}
                                >
                                  <FaCheck /> Present
                                </Button>
                                <Button
                                  variant={data.status === 'Absent' ? 'danger' : 'outline-danger'}
                                  size="sm"
                                  onClick={() => handleStatusChange(index, 'Absent')}
                                >
                                  <FaTimes /> Absent
                                </Button>
                                <Button
                                  variant={data.status === 'Late' ? 'warning' : 'outline-warning'}
                                  size="sm"
                                  onClick={() => handleStatusChange(index, 'Late')}
                                >
                                  Late
                                </Button>
                              </div>
                            </td>
                            <td>
                              <Form.Control
                                type="text"
                                size="sm"
                                placeholder="Remarks"
                                value={data.remarks}
                                onChange={(e) => handleRemarksChange(index, e.target.value)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  <div className="text-end mt-3">
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={submitting || attendanceData.length === 0}
                    >
                      {submitting ? 'Submitting...' : 'Submit Attendance'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherAttendance;