import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert, Badge,Button } from 'react-bootstrap';
import { FaArrowLeft, FaFileAlt, FaDownload } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

const ParentChildResults = () => {
  const { childId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/parent/results/${childId}`);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Failed to load results');
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

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

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get(`/api/student/report-card/${childId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-card-${moment().format('YYYY-MM-DD')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Report card downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report card');
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

  if (!data) {
    return (
      <Container className="py-5">
        <Alert variant="info">No results found</Alert>
      </Container>
    );
  }

  const { student, results } = data;

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
              <h2>Results</h2>
              <p className="text-muted">
                <FaFileAlt className="me-1" />
                {student?.user?.name} ({student?.rollNumber}) - Class {student?.class}-{student?.section}
              </p>
            </div>
            <Button variant="primary" onClick={handleDownloadReport}>
              <FaDownload className="me-2" /> Download Report Card
            </Button>
          </div>

          {results.length > 0 ? (
            results.map((result, index) => (
              <Card className="shadow-sm mb-4" key={index}>
                <Card.Header className="fw-bold bg-primary text-white">
                  {result.examName} - {moment(result.examDate).format('DD MMM YYYY')}
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
                <p className="text-muted">No results available for this student</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ParentChildResults;