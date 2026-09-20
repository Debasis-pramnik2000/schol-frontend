import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, Modal, Form, 
  Spinner, Alert, Pagination, Badge 
} from 'react-bootstrap';
import { 
  FaPlus, FaEdit, FaTrash, FaKey, FaUser, 
  FaEnvelope, FaPhone, FaUsers, FaUserFriends 
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminParents = () => {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    children: [],
    occupation: '',
    relationship: 'Guardian',
    address: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState([]);

  useEffect(() => {
    fetchParents();
    fetchStudents();
  }, []);

  const fetchParents = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/parents?page=${page}&limit=10`);
      setParents(response.data.data.parents);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching parents:', error);
      setError('Failed to load parents');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/admin/students?limit=1000');
      setStudents(response.data.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleChildSelect = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedChildren(selected);
    setFormData({
      ...formData,
      children: selected
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingParent) {
        await axios.put(`/api/admin/parents/${editingParent._id}`, formData);
        toast.success('Parent updated successfully');
      } else {
        const response = await axios.post('/api/admin/parents', formData);
        toast.success(`Parent created successfully! Username: ${response.data.data.credentials.username}, Password: ${response.data.data.credentials.password}`);
      }
      setShowModal(false);
      resetForm();
      fetchParents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this parent?')) {
      try {
        await axios.delete(`/api/admin/parents/${id}`);
        toast.success('Parent deleted successfully');
        fetchParents();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete parent');
      }
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt('Enter new password (min 6 characters):');
    if (newPassword && newPassword.length >= 6) {
      try {
        await axios.put(`/api/admin/parents/${id}/reset-password`, { newPassword });
        toast.success(`Password reset successfully! New password: ${newPassword}`);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to reset password');
      }
    } else if (newPassword !== null) {
      toast.warning('Password must be at least 6 characters');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      children: [],
      occupation: '',
      relationship: 'Guardian',
      address: ''
    });
    setSelectedChildren([]);
    setEditingParent(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (parent) => {
    setEditingParent(parent);
    const childIds = parent.children?.map(c => c._id) || [];
    setSelectedChildren(childIds);
    setFormData({
      name: parent.user.name,
      email: parent.user.email,
      phone: parent.user.phone || '',
      children: childIds,
      occupation: parent.occupation || '',
      relationship: parent.relationship || 'Guardian',
      address: parent.address || '',
      username: parent.user.username,
      password: ''
    });
    setShowModal(true);
  };

  if (loading && parents.length === 0) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading parents...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Parent Management</h2>
            <Button variant="primary" onClick={openCreateModal}>
              <FaPlus className="me-2" /> Add Parent
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
                      <th>Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Children</th>
                      <th>Relationship</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parents.map((parent, index) => (
                      <tr key={parent._id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={parent.user?.profilePicture || 'https://via.placeholder.com/40'} 
                              alt={parent.user?.name}
                              className="rounded-circle me-2"
                              width={40}
                              height={40}
                            />
                            <div>
                              <div className="fw-bold">{parent.user?.name}</div>
                              <small className="text-muted">{parent.relationship}</small>
                            </div>
                          </div>
                        </td>
                        <td>@{parent.user?.username}</td>
                        <td>{parent.user?.email}</td>
                        <td>
                          {parent.children?.length > 0 ? (
                            <div>
                              {parent.children.map((child, idx) => (
                                <Badge bg="info" className="me-1" key={idx}>
                                  {child.rollNumber} ({child.class})
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <Badge bg="secondary">No Children</Badge>
                          )}
                        </td>
                        <td>{parent.relationship}</td>
                        <td>
                          <Badge bg={parent.user?.isActive ? 'success' : 'danger'}>
                            {parent.user?.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => openEditModal(parent)}
                            >
                              <FaEdit />
                            </Button>
                            <Button 
                              variant="outline-warning" 
                              size="sm"
                              onClick={() => handleResetPassword(parent._id)}
                            >
                              <FaKey />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDelete(parent._id)}
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

              {pagination.pages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="text-muted">
                    Showing {parents.length} of {pagination.total} parents
                  </span>
                  <Pagination>
                    <Pagination.Prev 
                      onClick={() => fetchParents(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    />
                    {[...Array(pagination.pages)].map((_, i) => (
                      <Pagination.Item 
                        key={i + 1}
                        active={i + 1 === pagination.page}
                        onClick={() => fetchParents(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      onClick={() => fetchParents(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingParent ? 'Edit Parent' : 'Add New Parent'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FaUser className="me-2" />Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FaEnvelope className="me-2" />Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {!editingParent && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaUser className="me-2" />Username *</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaKey className="me-2" />Password *</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FaPhone className="me-2" />Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FaUserFriends className="me-2" />Relationship</Form.Label>
                  <Form.Select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label><FaUsers className="me-2" />Children (Select students)</Form.Label>
              <Form.Select
                multiple
                value={selectedChildren}
                onChange={handleChildSelect}
                size={5}
              >
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.user?.name} ({student.rollNumber}) - {student.class}-{student.section}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple students
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Occupation</Form.Label>
                  <Form.Control
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>

            {editingParent && (
              <Alert variant="info">
                <small>⚠️ Password cannot be changed here. Use the Reset Password button.</small>
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : (editingParent ? 'Update' : 'Create')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminParents;