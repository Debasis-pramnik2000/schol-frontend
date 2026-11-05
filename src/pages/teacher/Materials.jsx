import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Button, Modal, Form,
  Spinner, Alert, ProgressBar
} from 'react-bootstrap';
import { FaPlus, FaTrash, FaFilePdf, FaFileWord, FaFilePowerpoint, FaFile, FaUpload } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const TeacherMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    section: 'A'
  });

  useEffect(() => {
    fetchMaterials();
    fetchClasses();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/teacher/materials');
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
      const response = await api.get('/teacher/classes');
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.warning('Please select a file to upload');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('subject', formData.subject);
      uploadData.append('class', formData.class);
      uploadData.append('section', formData.section);

      await api.post('/teacher/materials', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        }
      });

      toast.success('Study material uploaded successfully');
      setShowModal(false);
      resetForm();
      fetchMaterials();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload material');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await api.delete(`/teacher/materials/${id}`);
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
      section: 'A'
    });
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const getFileIcon = (fileType) => {
    const icons = {
      pdf: <FaFilePdf className="text-danger" />,
      doc: <FaFileWord className="text-primary" />,
      docx: <FaFileWord className="text-primary" />,
      ppt: <FaFilePowerpoint className="text-warning" />,
      pptx: <FaFilePowerpoint className="text-warning" />
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
                              {getFileIcon(material.fileType)}{' '}
                              {(material.fileType || 'file').toUpperCase()}
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
            </Row>

            <Row>
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
              <Form.Label>File *</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.jpg,.jpeg,.png,.zip"
              />
              <Form.Text className="text-muted">
                Max size 50MB. Allowed: PDF, DOC, DOCX, PPT, PPTX, MP4, Images, ZIP
              </Form.Text>
              {selectedFile && (
                <div className="mt-2">
                  <small className="text-success">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </small>
                </div>
              )}
            </Form.Group>

            {submitting && uploadProgress > 0 && (
              <ProgressBar
                now={uploadProgress}
                label={`${uploadProgress}%`}
                className="mb-3"
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              <FaUpload className="me-1" />
              {submitting ? 'Uploading...' : 'Upload'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default TeacherMaterials;