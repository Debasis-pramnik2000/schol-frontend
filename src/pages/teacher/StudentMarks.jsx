import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaUser } from 'react-icons/fa';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';

const TeacherStudentMarks = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Fetch student marks (memoized)
  const fetchStudentMarks = useCallback(async () => {
    try {
      const response = await axios.get(`/api/teacher/marks/student/${studentId}`);
      setStudent(response.data.data.student);
      setResults(response.data.data.results);
    } catch (error) {
      console.error('Error fetching student marks:', error);
      setError('Failed to load marks');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  // ✅ Effect depends on the memoized function
  useEffect(() => {
    fetchStudentMarks();
  }, [fetchStudentMarks]);

  const getGradeBadge = (grade) => {
    const colors = {
      'A+': 'success',
      'A': 'success',
      'B+': 'info',
      'B': 'info',
      'C+': 'warning',
      'C': 'warning',
      'D': 'secondary',
      'F': 'danger'
    };
    return <Badge bg={colors[grade] || 'secondary'}>{grade}</Badge>;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading marks...</p>
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
          <div className="d-flex align-items-center mb-4">
            <Link to="/teacher/classes" className="text-decoration-none me-3">
              <span className="btn btn-outline-secondary btn-sm">
                <FaArrowLeft /> Back
              </span>
            </Link>
            <div>
              <h2 className="mb-0">
                <FaUser className="me-2" />
                {student?.user?.name}
              </h2>
              <p className="text-muted mb-0">
                Roll No: {student?.rollNumber} | Class {student?.class}-{student?.section}
              </p>
            </div>
          </div>

          {results.length > 0 ? (
            results.map((result, index) => (
              <Card className="shadow-sm mb-4" key={index}>
                <Card.Header className="fw-bold bg-primary text-white">
                  {result.examName} - {moment(result.examDate).format('DD MMM YYYY')}
                  <Badge bg={result.published ? 'success' : 'warning'} className="ms-2">
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
                            <td>{getGradeBadge(subject.grade)}</td>
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
                          <td>{getGradeBadge(result.grade)}</td>
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
                <p className="text-muted">No marks found for this student</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherStudentMarks;