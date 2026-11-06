import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Table,
  Badge
} from 'react-bootstrap';

import {
  FaFilePdf,
  FaFileExcel,
  FaPrint
} from 'react-icons/fa';

import api from '../../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const StudentReportCard = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    fetchStudentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch student results and correct Student ID
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/student/results');

      const studentResults = response.data.data || [];
      const actualStudentId = response.data.studentId;

      setStudentId(actualStudentId || '');
      setResults(studentResults);

      if (!actualStudentId) {
        setError('Student ID not found. Please contact the administrator.');
      }

    } catch (error) {
      console.error('Error fetching student data:', error);
      setError(
        error.response?.data?.message || 'Failed to load student data'
      );
    } finally {
      setLoading(false);
    }
  };

  // Download PDF Report Card
  const downloadPDF = async () => {
    if (!studentId) {
      toast.error('Student ID not found');
      return;
    }

    setDownloading(true);

    try {
      const response = await api.get(
        `/student/report-card/${studentId}`,
        {
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], {
        type: 'application/pdf'
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      link.setAttribute(
        'download',
        `report-card-${moment().format('YYYY-MM-DD')}.pdf`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success('Report card downloaded successfully!');

    } catch (error) {
      console.error('PDF Download error:', error);
      toast.error('Failed to download report card');
    } finally {
      setDownloading(false);
    }
  };

  // Download Excel Report Card
  const downloadExcel = async () => {
    if (!studentId) {
      toast.error('Student ID not found');
      return;
    }

    setDownloading(true);

    try {
      const response = await api.get(
        `/student/report-card/excel/${studentId}`,
        {
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      link.setAttribute(
        'download',
        `report-card-${moment().format('YYYY-MM-DD')}.xlsx`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success('Excel report downloaded successfully!');

    } catch (error) {
      console.error('Excel Download error:', error);
      toast.error('Failed to download Excel report');
    } finally {
      setDownloading(false);
    }
  };

  // Print Report Card
  const handlePrint = () => {
    window.print();
  };

  // Loading Screen
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading report card...</p>
      </Container>
    );
  }

  // Error Screen
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4" id="report-card">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <h2>My Report Card</h2>

            <div className="d-flex gap-2">
              <Button
                variant="danger"
                onClick={downloadPDF}
                disabled={downloading || results.length === 0 || !studentId}
              >
                <FaFilePdf className="me-2" />
                {downloading ? 'Downloading...' : 'Download PDF'}
              </Button>

              <Button
                variant="success"
                onClick={downloadExcel}
                disabled={downloading || results.length === 0 || !studentId}
              >
                <FaFileExcel className="me-2" />
                Download Excel
              </Button>

              <Button
                variant="info"
                onClick={handlePrint}
                disabled={results.length === 0}
              >
                <FaPrint className="me-2" />
                Print
              </Button>
            </div>
          </div>

          {results.length > 0 ? (
            results.map((result, index) => (
              <Card className="shadow-sm mb-4" key={index}>
                <Card.Header className="fw-bold bg-primary text-white d-flex justify-content-between">
                  <span>{result.examName}</span>

                  <Badge bg={result.published ? 'success' : 'warning'}>
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

                            <td>
                              <Badge
                                bg={
                                  subject.grade === 'A'
                                    ? 'success'
                                    : 'warning'
                                }
                              >
                                {subject.grade}
                              </Badge>
                            </td>

                            <td>{subject.remarks || '-'}</td>
                          </tr>
                        ))}
                      </tbody>

                      <tfoot>
                        <tr className="fw-bold">
                          <td colSpan="4" className="text-end">
                            Total:
                          </td>
                          <td>{result.totalMarks}</td>
                        </tr>

                        <tr className="fw-bold">
                          <td colSpan="4" className="text-end">
                            Percentage:
                          </td>
                          <td>{result.percentage}%</td>
                        </tr>

                        <tr className="fw-bold">
                          <td colSpan="4" className="text-end">
                            Overall Grade:
                          </td>
                          <td>
                            <Badge bg="success">{result.grade}</Badge>
                          </td>
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
                <p className="text-muted">
                  No results available for report card
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StudentReportCard;