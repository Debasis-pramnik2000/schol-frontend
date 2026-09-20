import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, 
  Alert, Spinner, Badge 
} from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FaSearch, FaCheckCircle, FaTimesCircle, FaClock, 
  FaArrowLeft, FaUser, FaGraduationCap, FaCalendarAlt, 
  FaPhone, FaIdCard, FaFileAlt, FaSchool, FaUserPlus,
  FaBan
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

const ApplicationStatus = () => {
  const [searchParams] = useSearchParams();
  const [applicationNumber, setApplicationNumber] = useState(
    searchParams.get('appNo') || ''
  );
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  // ✅ Auto-search if application number is in URL
  useEffect(() => {
    const appNoFromUrl = searchParams.get('appNo');
    if (appNoFromUrl) {
      handleSearch(null, appNoFromUrl);
    }
  }, []);

  const handleSearch = async (e, appNo = null) => {
    if (e) e.preventDefault();

    const searchNumber = appNo || applicationNumber.trim();

    if (!searchNumber) {
      toast.warning('Please enter your application number');
      return;
    }

    setLoading(true);
    setError('');
    setApplication(null);
    setSearched(true);

    try {
      const response = await axios.get(`/api/admission/status/${searchNumber}`);
      
      if (response.data.success) {
        setApplication(response.data.data);
        toast.success('Application found!');
      }
    } catch (error) {
      console.error('Search error:', error);
      const message = error.response?.data?.message || 'Application not found. Please check your application number.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get Status Configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Pending':
        return {
          color: 'warning',
          icon: <FaClock size={60} className="text-warning" />,
          title: 'Application Under Review',
          message: 'Your application is currently being reviewed by the admin. Please wait for the approval.',
          bg: 'bg-warning'
        };
      case 'Approved':
        return {
          color: 'success',
          icon: <FaCheckCircle size={60} className="text-success" />,
          title: 'Application Approved! 🎉',
          message: 'Congratulations! Your admission has been approved. Please contact the school for further details.',
          bg: 'bg-success'
        };
      case 'Rejected':
        return {
          color: 'danger',
          icon: <FaTimesCircle size={60} className="text-danger" />,
          title: 'Application Rejected',
          message: 'Unfortunately, your application has been rejected. Please check the remarks below.',
          bg: 'bg-danger'
        };
      case 'Cancelled':
        return {
          color: 'secondary',
          icon: <FaBan size={60} className="text-secondary" />,
          title: 'Application Cancelled',
          message: 'Your application has been cancelled.',
          bg: 'bg-secondary'
        };
      default:
        return {
          color: 'info',
          icon: <FaClock size={60} className="text-info" />,
          title: 'Status Unknown',
          message: 'Please contact the school for more information.',
          bg: 'bg-info'
        };
    }
  };

  return (
    <div className="application-status-page">
      {/* Header */}
      <div className="status-header">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="mb-2">
                <FaSearch className="me-3" />
                Application Status
              </h1>
              <p className="mb-0 text-white-50">
                <FaSchool className="me-2" />
                Check your admission application status
              </p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Link to="/" className="btn btn-outline-light me-2">
                <FaArrowLeft className="me-2" /> Home
              </Link>
              <Link to="/apply-online" className="btn btn-warning">
                <FaUserPlus className="me-2" /> Apply
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        {/* ==================== SEARCH FORM ==================== */}
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow-sm status-search-card mb-4">
              <Card.Body className="p-4">
                <h5 className="mb-3">
                  <FaSearch className="me-2" />
                  Enter Application Number
                </h5>
                <Form onSubmit={handleSearch}>
                  <Row className="g-2">
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        size="lg"
                        placeholder="e.g., ADM-2024-0001"
                        value={applicationNumber}
                        onChange={(e) => setApplicationNumber(e.target.value.toUpperCase())}
                        disabled={loading}
                      />
                    </Col>
                    <Col md={3}>
                      <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg"
                        className="w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <>
                            <FaSearch className="me-2" /> Search
                          </>
                        )}
                      </Button>
                    </Col>
                  </Row>
                </Form>
                <Alert variant="info" className="mt-3 mb-0 py-2">
                  <small>
                    💡 <strong>Tip:</strong> Your application number was shown after
                    submitting the admission form. It starts with <strong>ADM-</strong>.
                  </small>
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ==================== LOADING ==================== */}
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Searching application...</p>
          </div>
        )}

        {/* ==================== ERROR ==================== */}
        {error && !loading && (
          <Row className="justify-content-center">
            <Col lg={8}>
              <Alert variant="danger" className="text-center py-4">
                <FaTimesCircle size={50} className="mb-3" />
                <h4>Application Not Found</h4>
                <p className="mb-3">{error}</p>
                <Link to="/apply-online">
                  <Button variant="primary">
                    <FaUserPlus className="me-2" /> Apply Now
                  </Button>
                </Link>
              </Alert>
            </Col>
          </Row>
        )}

        {/* ==================== APPLICATION DETAILS ==================== */}
        {application && !loading && (
          <Row className="justify-content-center">
            <Col lg={10}>
              {/* Status Card */}
              <Card className={`shadow-sm mb-4 status-result-card border-0`}>
                <Card.Body className="p-4 text-center">
                  <div className="mb-3">
                    {getStatusConfig(application.status).icon}
                  </div>
                  <h3 className={`text-${getStatusConfig(application.status).color} mb-2`}>
                    {getStatusConfig(application.status).title}
                  </h3>
                  <p className="text-muted mb-3">
                    {getStatusConfig(application.status).message}
                  </p>
                  <Badge 
                    bg={getStatusConfig(application.status).color} 
                    className="fs-6 px-4 py-2"
                  >
                    {application.status}
                  </Badge>
                </Card.Body>
              </Card>

              {/* Application Info */}
              <Card className="shadow-sm mb-4 admission-detail-card">
                <Card.Header className="bg-primary text-white">
                  <FaFileAlt className="me-2" />
                  <strong>Application Information</strong>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3">
                    <Col md={6}>
                      <div className="info-item">
                        <small className="text-muted d-block">Application Number</small>
                        <strong className="text-primary fs-5">
                          {application.applicationNumber}
                        </strong>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item">
                        <small className="text-muted d-block">Applied On</small>
                        <strong>
                          {moment(application.createdAt).format('DD MMM YYYY, hh:mm A')}
                        </strong>
                      </div>
                    </Col>
                  </Row>

                  <hr />

                  <Row>
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <small className="text-muted d-block">
                          <FaUser className="me-1" /> Student Name
                        </small>
                        <strong>{application.studentName}</strong>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <small className="text-muted d-block">
                          <FaGraduationCap className="me-1" /> Applying for Class
                        </small>
                        <strong>
                          <Badge bg="info">{application.applyingForClass}</Badge>
                        </strong>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <small className="text-muted d-block">
                          <FaPhone className="me-1" /> Mobile Number
                        </small>
                        <strong>{application.mobile}</strong>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item mb-3">
                        <small className="text-muted d-block">
                          <FaCalendarAlt className="me-1" /> Date of Birth
                        </small>
                        <strong>
                          {moment(application.dateOfBirth).format('DD MMM YYYY')}
                        </strong>
                      </div>
                    </Col>
                  </Row>

                  {application.reviewedAt && (
                    <>
                      <hr />
                      <Row>
                        <Col md={6}>
                          <div className="info-item">
                            <small className="text-muted d-block">
                              Reviewed On
                            </small>
                            <strong>
                              {moment(application.reviewedAt).format('DD MMM YYYY, hh:mm A')}
                            </strong>
                          </div>
                        </Col>
                      </Row>
                    </>
                  )}

                  {application.remarks && (
                    <Alert 
                      variant={application.status === 'Approved' ? 'success' : 'danger'}
                      className="mt-3 mb-0"
                    >
                      <strong>Admin Remarks:</strong> {application.remarks}
                    </Alert>
                  )}
                </Card.Body>
              </Card>

              {/* Approved - Show Next Steps */}
              {application.status === 'Approved' && (
                <Card className="shadow-sm mb-4 border-success">
                  <Card.Header className="bg-success text-white">
                    <FaCheckCircle className="me-2" />
                    <strong>Next Steps</strong>
                  </Card.Header>
                  <Card.Body>
                    <h6>🎉 Congratulations! Your admission is approved.</h6>
                    <p className="mb-3">
                      Please visit the school office with the following:
                    </p>
                    <ul>
                      <li>Original Aadhaar Card</li>
                      <li>Original School Leaving Certificate</li>
                      <li>Previous Marksheet</li>
                      <li>4 Passport Size Photos</li>
                      <li>This Application Number: <strong>{application.applicationNumber}</strong></li>
                    </ul>
                    <Alert variant="info" className="mb-0">
                      <small>
                        📞 For queries, call the school office: <strong>+91 12345 67890</strong>
                      </small>
                    </Alert>
                  </Card.Body>
                </Card>
              )}

              {/* Actions */}
              <div className="text-center">
                <Button 
                  variant="outline-primary" 
                  className="me-2"
                  onClick={() => {
                    setApplicationNumber('');
                    setApplication(null);
                    setSearched(false);
                    setError('');
                  }}
                >
                  <FaSearch className="me-2" /> Search Another
                </Button>
                <Link to="/" className="btn btn-outline-secondary">
                  <FaArrowLeft className="me-2" /> Back to Home
                </Link>
              </div>
            </Col>
          </Row>
        )}

        {/* ==================== INITIAL STATE ==================== */}
        {!searched && !loading && !application && (
          <Row className="justify-content-center mt-3">
            <Col lg={8}>
              <Card className="shadow-sm text-center py-4 border-0">
                <Card.Body>
                  <FaSearch size={60} className="text-muted mb-3" />
                  <h5 className="text-muted">Enter your Application Number</h5>
                  <p className="text-muted mb-0">
                    Please enter the application number you received after submitting the form.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default ApplicationStatus;