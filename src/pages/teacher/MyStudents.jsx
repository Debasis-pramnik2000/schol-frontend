import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Row, Col, Card, Table, Spinner, Alert, 
  Badge, Form, Button, InputGroup 
} from 'react-bootstrap';
import { 
  FaUsers, FaSearch, FaBook, FaSchool, 
  FaFilter, FaTimes, FaSync, FaDownload 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const TeacherMyStudents = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [statistics, setStatistics] = useState({});
  const [retryCount, setRetryCount] = useState(0);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterClass) params.append('class', filterClass);
      if (filterSection) params.append('section', filterSection);

      const response = await api.get(`/api/teacher/students?${params}`);
      
      setStudents(response.data.data.students || []);
      setClasses(response.data.data.classes || []);
      setStatistics({
        totalStudents: response.data.data.totalStudents || 0,
        totalClasses: response.data.data.totalClasses || 0
      });
      
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students. Please try again.');
      
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [search, filterClass, filterSection, retryCount]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const getUniqueClasses = () => {
    return [...new Set(students.map(s => s.class))].filter(Boolean);
  };

  const getUniqueSections = () => {
    const filtered = students.filter(s => !filterClass || s.class === filterClass);
    return [...new Set(filtered.map(s => s.section))].filter(Boolean);
  };

  const clearFilters = () => {
    setSearch('');
    setFilterClass('');
    setFilterSection('');
  };

  const exportToCSV = () => {
    if (students.length === 0) {
      toast.warning('No students to export');
      return;
    }

    const headers = ['Roll No', 'Student Name', 'Class', 'Section', 'Email', 'Phone', 'Subjects'];
    const rows = students.map(s => [
      s.rollNumber || 'N/A',
      s.user?.name || 'N/A',
      s.class || 'N/A',
      s.section || 'N/A',
      s.user?.email || 'N/A',
      s.user?.phone || 'N/A',
      s.teacherSubjects?.map(sub => sub.name).join(', ') || 'N/A'
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-students-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully!');
  };

  if (loading && students.length === 0) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading students...</p>
      </Container>
    );
  }

  if (error && students.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h5>⚠️ {error}</h5>
          <Button 
            variant="outline-primary" 
            className="mt-2"
            onClick={fetchStudents}
          >
            <FaSync className="me-2" /> Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <div>
              <h2 className="mb-1">My Students</h2>
              <p className="text-muted">
                <FaUsers className="me-1" />
                Total {statistics.totalStudents} students in {statistics.totalClasses} classes
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={exportToCSV}
                disabled={students.length === 0}
              >
                <FaDownload className="me-1" /> Export CSV
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={fetchStudents}
                disabled={loading}
              >
                <FaSync className={loading ? 'spin' : ''} /> Refresh
              </Button>
            </div>
          </div>

          <Row className="mb-4">
            <Col md={3} sm={6}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-muted">Total Students</h6>
                  <h2 className="text-primary">{statistics.totalStudents}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-muted">Total Classes</h6>
                  <h2 className="text-success">{statistics.totalClasses}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-muted">Class Wise</h6>
                  <h5 className="text-info">
                    {classes.map(c => (
                      <Badge bg="info" className="me-1" key={c._id}>
                        {c.className}-{c.section} ({c.studentCount})
                      </Badge>
                    ))}
                  </h5>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-muted">Subjects Taught</h6>
                  <h5 className="text-warning">
                    {classes.map(c => (
                      c.subjects?.map((sub, i) => (
                        <Badge bg="warning" className="me-1 text-dark" key={i}>
                          {sub}
                        </Badge>
                      ))
                    ))}
                  </h5>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text><FaSearch /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by name or roll number..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setSearch('')}
                      >
                        <FaTimes />
                      </Button>
                    )}
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {getUniqueClasses().map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filterSection}
                    onChange={(e) => setFilterSection(e.target.value)}
                    disabled={!filterClass}
                  >
                    <option value="">All Sections</option>
                    {getUniqueSections().map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="outline-secondary" 
                    onClick={clearFilters}
                    className="w-100"
                  >
                    <FaFilter className="me-1" /> Clear
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              {students.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Class</th>
                        <th>Section</th>
                        <th>Roll No</th>
                        <th>Subjects</th>
                        <th>Email</th>
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
                          <td>
                            <Badge bg="primary">{student.class}</Badge>
                          </td>
                          <td>
                            <Badge bg="info">Section {student.section}</Badge>
                          </td>
                          <td>
                            <Badge bg="secondary">{student.rollNumber}</Badge>
                          </td>
                          <td>
                            {student.teacherSubjects && student.teacherSubjects.length > 0 ? (
                              <div className="d-flex flex-wrap gap-1">
                                {student.teacherSubjects.map((sub, i) => (
                                  <Badge bg="warning" className="text-dark" key={i}>
                                    <FaBook className="me-1" />
                                    {sub.name}
                                    {sub.code && <small className="ms-1">({sub.code})</small>}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <Badge bg="secondary">No Subjects</Badge>
                            )}
                          </td>
                          <td>
                            <small className="text-muted">{student.user?.email}</small>
                          </td>
                          <td>
                            <Link to={`/teacher/marks/student/${student._id}`}>
                              <Button variant="outline-primary" size="sm">
                                <FaBook className="me-1" /> Marks
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FaUsers size={50} className="text-muted mb-3" />
                  <h5 className="text-muted">No Students Found</h5>
                  <p className="text-muted">
                    {search || filterClass || filterSection 
                      ? 'Try adjusting your filters' 
                      : 'No students are assigned to your classes yet'}
                  </p>
                  {(search || filterClass || filterSection) && (
                    <Button variant="outline-primary" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>

          {classes.length > 0 && students.length > 0 && (
            <Row className="mt-4">
              <Col>
                <Card className="shadow-sm">
                  <Card.Header className="fw-bold">
                    <FaSchool className="me-2" />
                    Class-wise Student Summary
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      {classes.map((cls, index) => (
                        <Col md={4} key={index}>
                          <div className="border rounded p-3 mb-2">
                            <h6 className="mb-2">
                              {cls.className} - Section {cls.section}
                            </h6>
                            <div className="d-flex justify-content-between">
                              <span className="text-muted">Students:</span>
                              <Badge bg="primary">{cls.studentCount}</Badge>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span className="text-muted">Subjects:</span>
                              <div>
                                {cls.subjects?.map((sub, i) => (
                                  <Badge bg="warning" className="me-1 text-dark" key={i}>
                                    {sub}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherMyStudents;