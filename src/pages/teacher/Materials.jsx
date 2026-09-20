import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, Modal, Form, 
  Spinner, Alert 
} from 'react-bootstrap';
import { FaPlus, FaTrash, FaFilePdf, FaFileWord, FaFilePowerpoint, FaFile } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

const TeacherMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    section: 'A',
    fileUrl: '',
    fileType: 'pdf'
  });

  useEffect(() => {
    fetchMaterials();
    fetchClasses();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/teacher/materials');
      setMaterials(response.data.data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/teacher/classes');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post('/api/teacher/materials', formData);
      toast.success('Study material uploaded successfully');
      setShowModal(false);
      resetForm();
      fetchMaterials();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload material');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await axios.delete(`/api/teacher/materials/${id}`);
        toast.success('Material deleted successfully');
        fetchMaterials();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete material');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      class: '',
      section: 'A',
      fileUrl: '',
      fileType: 'pdf'
    });
  };

  const getFileIcon = (fileType) => {
    const icons = {
      'pdf': <FaFilePdf className="text-danger" />,
      'doc': <FaFileWord className="text-primary" />,
      'docx': <FaFileWord className="text-primary" />,
      'ppt': <FaFilePowerpoint className="text-warning" />,
      'pptx': <FaFilePowerpoint className="text-warning" />
    };
    return icons[fileType] || <FaFile className="text-secondary" />;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading materials...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Study Materials</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <FaPlus className="me-2" /> Upload Material
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Card className="shadow-sm">
            <Card.Body>
              {materials.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Subject</th>
                        <th>Class</th>
                        <th>File</th>
                        <th>Uploaded</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map((material, index) => (
                        <tr key={material._id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="fw-bold">{material.title}</div>
                            <small className="text-muted">{material.description}</small>
                          </td>
                          <td>{material.subject}</td>
                          <td>{material.class}-{material.section}</td>
                          <td>
                            <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                              {getFileIcon(material.fileType)} {material.fileType.toUpperCase()}
                            </a>
                          </td>
                          <td>
                            <small className="text-muted">
                              {moment(material.createdAt).format('DD MMM YYYY')}
                            </small>
                          </td>
                          <td>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDelete(material._id)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-muted py-3">
                  No study materials uploaded yet
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Upload Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Study Material</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Mathematics"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>File Type</Form.Label>
                  <Form.Select
                    name="fileType"
                    value={formData.fileType}
                    onChange={handleChange}
                  >
                    <option value="pdf">PDF</option>
                    <option value="doc">Word (DOC)</option>
                    <option value="docx">Word (DOCX)</option>
                    <option value="ppt">PowerPoint (PPT)</option>
                    <option value="pptx">PowerPoint (PPTX)</option>
                    <option value="mp4">Video (MP4)</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Class</Form.Label>
                  <Form.Select
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls._id} value={cls.className}>
                        {cls.className}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Section</Form.Label>
                  <Form.Select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>File URL *</Form.Label>
              <Form.Control
                type="url"
                name="fileUrl"
                value={formData.fileUrl}
                onChange={handleChange}
                required
                placeholder="https://example.com/file.pdf"
              />
              <Form.Text className="text-muted">
                Enter the URL of the uploaded file (Google Drive, Dropbox, etc.)
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Uploading...' : 'Upload'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default TeacherMaterials;