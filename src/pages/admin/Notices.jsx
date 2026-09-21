import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, Modal, Form, 
  Spinner, Alert, Badge 
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetRoles: ['student', 'teacher', 'admin'],
    priority: 'Medium',
    expiresAt: '',
    attachments: [],
    isPublic: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/notices');
      setNotices(response.data.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setError('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const roles = [...formData.targetRoles];
      if (checked) {
        roles.push(value);
      } else {
        const index = roles.indexOf(value);
        if (index > -1) roles.splice(index, 1);
      }
      setFormData({ ...formData, targetRoles: roles });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingNotice) {
        await api.put(`/api/admin/notices/${editingNotice._id}`, formData);
        toast.success('Notice updated successfully');
      } else {
        await api.post('/api/admin/notices', formData);
        toast.success('Notice created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await api.delete(`/api/admin/notices/${id}`);
        toast.success('Notice deleted successfully');
        fetchNotices();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete notice');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      targetRoles: ['student', 'teacher', 'admin'],
      priority: 'Medium',
      expiresAt: '',
      attachments: [],
      isPublic: false
    });
    setEditingNotice(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      targetRoles: notice.targetRoles,
      priority: notice.priority,
      expiresAt: notice.expiresAt ? notice.expiresAt.split('T')[0] : '',
      attachments: notice.attachments || [],
      isPublic: notice.isPublic || false
    });
    setShowModal(true);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'secondary',
      'Medium': 'info',
      'High': 'warning',
      'Urgent': 'danger'
    };
    return colors[priority] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading notices...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Notice Management</h2>
            <Button variant="primary" onClick={openCreateModal}>
              <FaPlus className="me-2" /> Add Notice
            </Button>
          </div>

          <Card className="shadow-sm">
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Content</th>
                      <th>Target</th>
                      <th>Priority</th>
                      <th>Public</th>
                      <th>Posted By</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notices.map((notice, index) => (
                      <tr key={notice._id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="fw-bold">{notice.title}</div>
                        </td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: '200px' }}>
                            {notice.content}
                          </div>
                        </td>
                        <td>
                          {notice.targetRoles.map((role, i) => (
                            <Badge bg="secondary" className="me-1" key={i}>
                              {role}
                            </Badge>
                          ))}
                        </td>
                        <td>
                          <Badge bg={getPriorityColor(notice.priority)}>
                            {notice.priority}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={notice.isPublic ? 'success' : 'secondary'}>
                            {notice.isPublic ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td>{notice.author?.name || 'Unknown'}</td>
                        <td>{moment(notice.createdAt).format('DD MMM YYYY')}</td>
                        <td>
                          <Badge bg={notice.isActive ? 'success' : 'danger'}>
                            {notice.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => openEditModal(notice)}
                            >
                              <FaEdit />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDelete(notice._id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingNotice ? 'Edit Notice' : 'Add New Notice'}
          </Modal.Title>
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
              <Form.Label>Content *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Show this notice on Home Page (Public)"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              />
              <Form.Text className="text-muted">
                If checked, this notice will be visible on the home page for everyone
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Target Audience</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="checkbox"
                  label="Students"
                  value="student"
                  checked={formData.targetRoles.includes('student')}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Teachers"
                  value="teacher"
                  checked={formData.targetRoles.includes('teacher')}
                  onChange={handleChange}
                />
                <Form.Check
                  type="checkbox"
                  label="Admin"
                  value="admin"
                  checked={formData.targetRoles.includes('admin')}
                  onChange={handleChange}
                />
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expires At</Form.Label>
                  <Form.Control
                    type="date"
                    name="expiresAt"
                    value={formData.expiresAt}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : (editingNotice ? 'Update' : 'Create')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminNotices;