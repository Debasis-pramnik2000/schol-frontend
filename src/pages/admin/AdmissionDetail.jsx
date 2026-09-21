import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Row, Col, Card, Button, Badge, 
  Spinner, Alert, Modal, Form
} from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaUser, FaIdCard, FaMapMarkerAlt,
  FaGraduationCap, FaFileAlt, FaCheckCircle,
  FaTimesCircle, FaClock, FaBan, FaEye, FaDownload,
  FaCheck, FaTimes, FaTrash, FaPrint, FaFilePdf, FaImage
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

// ✅ HARDCODED Backend URL for images
const BACKEND_URL = 'https://scholl-backend-1.onrender.com';

const AdminAdmissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [remarks, setRemarks] = useState('');

  const fetchAdmission = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/api/admin/admissions/${id}`);
      
      console.log('📥 Admission Data:', response.data.data);
      console.log('📷 Photo:', response.data.data.studentPhoto);
      console.log('🆔 Aadhaar:', response.data.data.aadhaarCard);
      console.log('📄 LC:', response.data.data.leavingCertificate);
      
      setAdmission(response.data.data);
    } catch (error) {
      console.error('Fetch admission error:', error);
      setError(error.response?.data?.message || 'Failed to load admission');
      toast.error('Failed to load admission');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAdmission();
  }, [fetchAdmission]);

  const getImageUrl = (path) => {
    if (!path) return null;
    
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    if (path.startsWith('/uploads')) {
      return `${BACKEND_URL}${path}`;
    }
    
    if (path.startsWith('uploads')) {
      return `${BACKEND_URL}/${path}`;
    }
    
    return `${BACKEND_URL}/${path}`;
  };

  const isImageFile = (path) => {
    if (!path) return false;
    let cleanPath = path.split('?')[0].split('#')[0];
    const parts = cleanPath.toLowerCase().split('.');
    if (parts.length < 2) return false;
    const ext = parts[parts.length - 1];
    return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg'].includes(ext);
  };

  const isPdfFile = (path) => {
    if (!path) return false;
    const cleanPath = path.split('?')[0].split('#')[0];
    return cleanPath.toLowerCase().endsWith('.pdf');
  };

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      const response = await api.put(
        `/api/admin/admissions/${id}/approve`,
        { remarks: remarks || 'Approved by admin' }
      );

      if (response.data.success) {
        const creds = response.data.data.credentials;
        const student = response.data.data.student;

        toast.success(
          <div>
            <strong>✅ Approved!</strong>
            <div className="mt-2 small">
              <div>User: <strong>{creds.username}</strong></div>
              <div>Pass: <strong>{creds.password}</strong></div>
              <div>Roll: <strong>{student.rollNumber}</strong></div>
            </div>
          </div>,
          { autoClose: 15000 }
        );

        setShowApproveModal(false);
        setRemarks('');
        fetchAdmission();
      }
    } catch (error) {
      console.error('Approve error:', error);
      toast.error(error.response?.data?.message || 'Failed to approve');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      toast.warning('Please provide a reason for rejection');
      return;
    }

    setSubmitting(true);
    try {
      await api.put(`/api/admin/admissions/${id}/reject`, { remarks });
      toast.success('Admission rejected successfully');
      setShowRejectModal(false);
      setRemarks('');
      fetchAdmission();
    } catch (error) {
      console.error('Reject error:', error);
      toast.error(error.response?.data?.message || 'Failed to reject');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/api/admin/admissions/${id}`);
      toast.success('Admission deleted successfully');
      navigate('/admin/admissions');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      'Pending': {
        bg: 'warning',
        text: 'text-warning',
        icon: <FaClock size={50} />,
        title: 'Pending Review'
      },
      'Approved': {
        bg: 'success',
        text: 'text-success',
        icon: <FaCheckCircle size={50} />,
        title: 'Approved'
      },
      'Rejected': {
        bg: 'danger',
        text: 'text-danger',
        icon: <FaTimesCircle size={50} />,
        title: 'Rejected'
      },
      'Cancelled': {
        bg: 'secondary',
        text: 'text-secondary',
        icon: <FaBan size={50} />,
        title: 'Cancelled'
      }
    };
    return config[status] || config['Pending'];
  };

  const openImageModal = (imagePath, title) => {
    if (!imagePath) {
      toast.warning('No document available');
      return;
    }

    const fullUrl = getImageUrl(imagePath);
    const isImage = isImageFile(imagePath);
    const isPdf = isPdfFile(imagePath);

    console.log('🖼️ Opening:', {
      path: imagePath,
      fullUrl: fullUrl,
      isImage: isImage,
      isPdf: isPdf
    });

    setSelectedImage({
      url: fullUrl,
      title,
      isPdf: isPdf,
      isImage: isImage
    });
    setShowImageModal(true);
  };

  const downloadDocument = async (imagePath, filename) => {
    if (!imagePath) {
      toast.warning('No document available');
      return;
    }

    try {
      const fullUrl = imagePath.startsWith('http') ? imagePath : getImageUrl(imagePath);
      console.log('⬇️ Downloading:', fullUrl);

      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download');
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Loading admission...</p>
      </Container>
    );
  }

  if (error || !admission) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h5>{error || 'Admission not found'}</h5>
          <Link to="/admin/admissions">
            <Button variant="primary" className="mt-2">
              <FaArrowLeft className="me-2" /> Back to Admissions
            </Button>
          </Link>
        </Alert>
      </Container>
    );
  }

  const statusConfig = getStatusConfig(admission.status);

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <Link to="/admin/admissions" className="text-decoration-none">
            <Button variant="outline-secondary" size="sm" className="mb-2">
              <FaArrowLeft className="me-2" /> Back to List
            </Button>
          </Link>
          <h2 className="mb-1">
            <FaFileAlt className="me-2 text-primary" />
            Application Details
          </h2>
          <p className="text-muted mb-0">
            Application No: <strong className="text-primary">
              {admission.applicationNumber}
            </strong>
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {admission.status === 'Pending' && (
            <>
              <Button variant="success" onClick={() => setShowApproveModal(true)}>
                <FaCheck className="me-2" /> Approve
              </Button>
              <Button variant="danger" onClick={() => setShowRejectModal(true)}>
                <FaTimes className="me-2" /> Reject
              </Button>
            </>
          )}
          <Button variant="outline-secondary" onClick={() => window.print()}>
            <FaPrint className="me-2" /> Print
          </Button>
          <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
            <FaTrash />
          </Button>
        </div>
      </div>

      <Card className="shadow-sm mb-4 border-0">
        <Card.Body className="text-center py-4">
          <div className={statusConfig.text}>{statusConfig.icon}</div>
          <h3 className={`mt-3 ${statusConfig.text}`}>{statusConfig.title}</h3>
          <Badge bg={statusConfig.bg} className="fs-6 px-4 py-2">
            {admission.status}
          </Badge>
          {admission.reviewedAt && (
            <p className="text-muted small mt-2 mb-0">
              Reviewed on: {moment(admission.reviewedAt).format('DD MMM YYYY, hh:mm A')}
              {admission.reviewedBy?.name && ` by ${admission.reviewedBy.name}`}
            </p>
          )}
        </Card.Body>
      </Card>

      {admission.remarks && (
        <Alert variant={admission.status === 'Approved' ? 'success' : 'danger'}>
          <strong>Admin Remarks:</strong> {admission.remarks}
        </Alert>
      )}

      {admission.status === 'Approved' && admission.generatedUsername && (
        <Card className="shadow-sm mb-4 border-success">
          <Card.Header className="bg-success text-white">
            <FaCheckCircle className="me-2" />
            <strong>🎉 Generated Credentials</strong>
          </Card.Header>
          <Card.Body>
            <Alert variant="warning" className="mb-3">
              <strong>⚠️ Important:</strong> Save these credentials and share
              with the student. They won't be shown again.
            </Alert>
            <Row>
              <Col md={4}>
                <div className="credential-box">
                  <small className="text-muted d-block mb-1">Username</small>
                  <strong className="text-primary fs-5">
                    {admission.generatedUsername}
                  </strong>
                </div>
              </Col>
              <Col md={4}>
                <div className="credential-box">
                  <small className="text-muted d-block mb-1">Password</small>
                  <strong className="text-danger fs-5">
                    {admission.generatedPassword}
                  </strong>
                </div>
              </Col>
              <Col md={4}>
                <div className="credential-box">
                  <small className="text-muted d-block mb-1">Roll Number</small>
                  <strong className="text-success fs-5">
                    {admission.generatedRollNumber}
                  </strong>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4 border-0">
            <Card.Header className="bg-primary text-white">
              <FaUser className="me-2" />
              <strong>Personal Information</strong>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <InfoRow label="Student Name" value={admission.studentName} />
                </Col>
                <Col md={6}>
                  <InfoRow label="Father's Name" value={admission.fatherName} />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <InfoRow label="Mother's Name" value={admission.motherName || 'N/A'} />
                </Col>
                <Col md={6}>
                  <InfoRow 
                    label="Date of Birth" 
                    value={moment(admission.dateOfBirth).format('DD MMM YYYY')} 
                  />
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <InfoRow label="Age" value={`${admission.age} years`} />
                </Col>
                <Col md={4}>
                  <InfoRow label="Gender" value={admission.gender} />
                </Col>
                <Col md={4}>
                  <InfoRow label="Mobile" value={admission.mobile} />
                </Col>
              </Row>
              {admission.alternateMobile && (
                <Row>
                  <Col md={6}>
                    <InfoRow label="Alternate Mobile" value={admission.alternateMobile} />
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4 border-0">
            <Card.Header className="bg-info text-white">
              <FaIdCard className="me-2" />
              <strong>Aadhaar Information</strong>
            </Card.Header>
            <Card.Body>
              <InfoRow label="Aadhaar Number" value={admission.aadhaarNumber} />
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4 border-0">
            <Card.Header className="bg-success text-white">
              <FaMapMarkerAlt className="me-2" />
              <strong>Address</strong>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={12}>
                  <InfoRow label="Street" value={admission.address?.street || 'N/A'} />
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <InfoRow label="City" value={admission.address?.city || 'N/A'} />
                </Col>
                <Col md={4}>
                  <InfoRow label="State" value={admission.address?.state || 'N/A'} />
                </Col>
                <Col md={4}>
                  <InfoRow label="Pincode" value={admission.address?.pincode || 'N/A'} />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4 border-0">
            <Card.Header className="bg-warning text-dark">
              <FaGraduationCap className="me-2" />
              <strong>Class Information</strong>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <InfoRow label="Applying for Class" value={admission.applyingForClass} />
                </Col>
                <Col md={6}>
                  <InfoRow label="Preferred Section" value={`Section ${admission.section}`} />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4 border-0">
            <Card.Header className="bg-secondary text-white">
              <FaGraduationCap className="me-2" />
              <strong>Education Information</strong>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <InfoRow label="Last Qualification" value={admission.lastQualification} />
                </Col>
                <Col md={6}>
                  <InfoRow label="Previous School" value={admission.previousSchool} />
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <InfoRow label="Last Class Passed" value={admission.lastClassPassed} />
                </Col>
                <Col md={4}>
                  <InfoRow label="Percentage/Grade" value={`${admission.percentage}%`} />
                </Col>
                <Col md={4}>
                  <InfoRow label="Year of Passing" value={admission.yearOfPassing} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm mb-4 border-0">
            <Card.Header className="bg-dark text-white">
              <FaFileAlt className="me-2" />
              <strong>Application Info</strong>
            </Card.Header>
            <Card.Body>
              <InfoRow 
                label="Application Number" 
                value={
                  <strong className="text-primary">
                    {admission.applicationNumber}
                  </strong>
                } 
              />
              <InfoRow 
                label="Applied On" 
                value={moment(admission.createdAt).format('DD MMM YYYY, hh:mm A')} 
              />
              <InfoRow 
                label="Status" 
                value={
                  <Badge bg={statusConfig.bg}>
                    {admission.status}
                  </Badge>
                } 
              />
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4 border-0">
            <Card.Header className="bg-danger text-white">
              <FaFileAlt className="me-2" />
              <strong>Documents</strong>
            </Card.Header>
            <Card.Body>
              <DocumentCard
                title="Student Photo"
                imagePath={admission.studentPhoto}
                isImage={isImageFile(admission.studentPhoto)}
                onView={() => openImageModal(admission.studentPhoto, 'Student Photo')}
                onDownload={() => downloadDocument(
                  admission.studentPhoto, 
                  `photo-${admission.applicationNumber}.jpg`
                )}
              />

              <DocumentCard
                title="Aadhaar Card"
                imagePath={admission.aadhaarCard}
                isImage={isImageFile(admission.aadhaarCard)}
                onView={() => openImageModal(admission.aadhaarCard, 'Aadhaar Card')}
                onDownload={() => downloadDocument(
                  admission.aadhaarCard, 
                  `aadhaar-${admission.applicationNumber}.jpg`
                )}
              />

              <DocumentCard
                title="Leaving Certificate"
                imagePath={admission.leavingCertificate}
                isImage={isImageFile(admission.leavingCertificate)}
                onView={() => openImageModal(admission.leavingCertificate, 'Leaving Certificate')}
                onDownload={() => downloadDocument(
                  admission.leavingCertificate, 
                  `lc-${admission.applicationNumber}.jpg`
                )}
              />

              {admission.marksheet && (
                <DocumentCard
                  title="Marksheet"
                  imagePath={admission.marksheet}
                  isImage={isImageFile(admission.marksheet)}
                  onView={() => openImageModal(admission.marksheet, 'Marksheet')}
                  onDownload={() => downloadDocument(
                    admission.marksheet, 
                    `marksheet-${admission.applicationNumber}.jpg`
                  )}
                />
              )}
            </Card.Body>
          </Card>

          {admission.status === 'Pending' && (
            <Card className="shadow-sm mb-4 border-warning">
              <Card.Header className="bg-warning text-dark">
                <strong>⚡ Quick Actions</strong>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="success" onClick={() => setShowApproveModal(true)}>
                    <FaCheck className="me-2" /> Approve
                  </Button>
                  <Button variant="danger" onClick={() => setShowRejectModal(true)}>
                    <FaTimes className="me-2" /> Reject
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title><FaCheckCircle className="me-2" /> Approve Admission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <strong>Application:</strong> {admission.applicationNumber}<br />
            <strong>Student:</strong> {admission.studentName}<br />
            <strong>Class:</strong> {admission.applyingForClass}
          </Alert>
          <Alert variant="warning">
            <strong>⚠️ System will auto-generate:</strong>
            <ul className="mb-0 mt-2">
              <li>Username & Password</li>
              <li>Roll Number</li>
              <li>User Account</li>
              <li>Student Profile</li>
            </ul>
          </Alert>
          <Form.Group>
            <Form.Label>Remarks (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleApprove} disabled={submitting}>
            {submitting ? (
              <><Spinner animation="border" size="sm" className="me-2" /> Approving...</>
            ) : (
              <><FaCheck className="me-2" /> Approve & Create Student</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title><FaTimesCircle className="me-2" /> Reject Admission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <strong>Application:</strong> {admission.applicationNumber}<br />
            <strong>Student:</strong> {admission.studentName}
          </Alert>
          <Form.Group>
            <Form.Label>
              Reason for Rejection <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g., Documents incomplete, Age criteria not met"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleReject} 
            disabled={submitting || !remarks.trim()}
          >
            {submitting ? 'Rejecting...' : 'Reject Application'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-secondary text-white">
          <Modal.Title><FaTrash className="me-2" /> Delete Admission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <strong>⚠️ Warning!</strong> This will permanently delete:
            <ul className="mb-0 mt-2">
              <li>Application: {admission.applicationNumber}</li>
              <li>All uploaded documents</li>
              <li>This action cannot be undone</li>
            </ul>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={submitting}>
            {submitting ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal 
        show={showImageModal} 
        onHide={() => setShowImageModal(false)}
        size="xl"
        centered
        contentClassName="bg-dark"
      >
        <Modal.Header closeButton className="bg-dark text-white border-secondary">
          <Modal.Title>
            {selectedImage?.isImage ? (
              <><FaImage className="me-2 text-primary" /> {selectedImage.title}</>
            ) : (
              <><FaFilePdf className="me-2 text-danger" /> {selectedImage?.title}</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body 
          className="text-center p-0" 
          style={{ 
            backgroundColor: '#1a1a1a', 
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {selectedImage && selectedImage.isImage && !selectedImage.isPdf ? (
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title}
              style={{ 
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                display: 'block',
                margin: 'auto'
              }}
              onError={(e) => {
                console.error('❌ Image failed to load:', selectedImage.url);
                e.target.style.display = 'none';
                if (e.target.parentElement) {
                  e.target.parentElement.innerHTML = `
                    <div style="padding: 50px; color: white; text-align: center;">
                      <h4>❌ Image Could Not Load</h4>
                      <p style="color: #999; margin: 20px 0; word-break: break-all; font-size: 12px;">${selectedImage.url}</p>
                      <a href="${selectedImage.url}" target="_blank" style="
                        display: inline-block;
                        padding: 10px 20px;
                        background: #0d6efd;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        margin-top: 10px;
                      ">Open in New Tab</a>
                    </div>
                  `;
                }
              }}
              onLoad={() => console.log('✅ Image loaded:', selectedImage.url)}
            />
          ) : selectedImage?.isPdf ? (
            <div className="py-5 text-white">
              <FaFilePdf size={100} className="text-danger mb-3" />
              <h4>PDF Document</h4>
              <p className="text-muted mb-4">Click below to view in new tab</p>
              <a 
                href={selectedImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                <FaEye className="me-2" /> Open PDF
              </a>
            </div>
          ) : (
            <div className="py-5 text-white">
              <FaFileAlt size={100} className="text-muted mb-3" />
              <h4>Preview Not Available</h4>
              {selectedImage?.url && (
                <a 
                  href={selectedImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mt-3"
                >
                  <FaEye className="me-2" /> Open in New Tab
                </a>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark text-white border-secondary">
          <div className="me-auto" style={{ maxWidth: '60%' }}>
            <small className="text-muted d-block" style={{ wordBreak: 'break-all', fontSize: '10px' }}>
              {selectedImage?.url}
            </small>
          </div>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
          <Button 
            variant="success"
            onClick={() => downloadDocument(selectedImage?.url, selectedImage?.title)}
          >
            <FaDownload className="me-2" /> Download
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="info-row mb-3">
    <small className="text-muted d-block mb-1">
      {icon && <span className="me-1">{icon}</span>}
      {label}
    </small>
    <div className="fw-semibold">{value}</div>
  </div>
);

const DocumentCard = ({ title, imagePath, isImage, onView, onDownload }) => (
  <div className="document-card mb-3 p-3 border rounded">
    <div className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <span style={{ fontSize: '24px' }} className="me-2">
          {isImage ? <FaImage className="text-primary" /> : <FaFilePdf className="text-danger" />}
        </span>
        <div>
          <strong className="d-block small">{title}</strong>
          <small className="text-muted">
            {imagePath ? (isImage ? 'Image' : 'PDF') : '❌ Not Uploaded'}
          </small>
        </div>
      </div>
      <div className="d-flex gap-1">
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={onView}
          disabled={!imagePath}
        >
          <FaEye />
        </Button>
        <Button 
          variant="outline-success" 
          size="sm" 
          onClick={onDownload}
          disabled={!imagePath}
        >
          <FaDownload />
        </Button>
      </div>
    </div>
  </div>
);

export default AdminAdmissionDetail;