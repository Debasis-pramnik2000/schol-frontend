import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Badge, Button } from 'react-bootstrap';
import { FaFilePdf, FaFileWord, FaFilePowerpoint, FaFile, FaDownload, FaUser, FaCalendarAlt, FaBook } from 'react-icons/fa';
import api from '../../services/api';
import moment from 'moment';
import { toast } from 'react-toastify';

const StudentMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/student/materials');
      setMaterials(response.data.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError('Failed to load study materials');
      toast.error('Failed to load study materials');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType) => {
    const icons = {
      'pdf': <FaFilePdf className="text-danger" size={30} />,
      'doc': <FaFileWord className="text-primary" size={30} />,
      'docx': <FaFileWord className="text-primary" size={30} />,
      'ppt': <FaFilePowerpoint className="text-warning" size={30} />,
      'pptx': <FaFilePowerpoint className="text-warning" size={30} />,
      'xls': <FaFileWord className="text-success" size={30} />,
      'xlsx': <FaFileWord className="text-success" size={30} />,
      'mp4': <FaFile className="text-danger" size={30} />,
      'other': <FaFile className="text-secondary" size={30} />
    };
    return icons[fileType] || icons['other'];
  };

  const getFileTypeBadge = (fileType) => {
    const colors = {
      'pdf': 'danger',
      'doc': 'primary',
      'docx': 'primary',
      'ppt': 'warning',
      'pptx': 'warning',
      'xls': 'success',
      'xlsx': 'success',
      'mp4': 'danger',
      'other': 'secondary'
    };
    return colors[fileType] || 'secondary';
  };

  const handleDownload = (fileUrl, title) => {
    window.open(fileUrl, '_blank');
    toast.info(`Opening ${title}...`);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading study materials...</p>
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Study Materials</h2>
            <Badge bg="info" className="fs-6">
              Total: {materials.length} Materials
            </Badge>
          </div>

          {materials.length > 0 ? (
            <Row>
              {materials.map((material, index) => (
                <Col md={6} lg={4} key={material._id}>
                  <Card className="shadow-sm mb-4 h-100">
                    <Card.Body>
                      <div className="d-flex align-items-start mb-3">
                        <div className="me-3">
                          {getFileIcon(material.fileType)}
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="mb-1">{material.title}</h5>
                          <Badge bg={getFileTypeBadge(material.fileType)}>
                            {material.fileType?.toUpperCase() || 'FILE'}
                          </Badge>
                          <Badge bg="secondary" className="ms-1">
                            <FaBook className="me-1" />
                            {material.subject}
                          </Badge>
                        </div>
                      </div>

                      {material.description && (
                        <p className="text-muted small mb-3">
                          {material.description}
                        </p>
                      )}

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="text-muted small">
                          <div>
                            <FaUser className="me-1" />
                            {material.uploadedBy?.name || 'Unknown'}
                          </div>
                          <div>
                            <FaCalendarAlt className="me-1" />
                            {moment(material.createdAt).format('DD MMM YYYY')}
                          </div>
                          <div>
                            <FaBook className="me-1" />
                            {material.class}-{material.section}
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleDownload(material.fileUrl, material.title)}
                        >
                          <FaDownload className="me-1" /> View
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <div className="mb-3">
                  <FaFile size={50} className="text-muted" />
                </div>
                <h5 className="text-muted">No Study Materials Available</h5>
                <p className="text-muted">
                  Your teachers haven't uploaded any study materials yet.
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StudentMaterials;