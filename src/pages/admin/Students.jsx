
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Pagination,
  Badge
} from 'react-bootstrap';

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaKey,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaIdCard
} from 'react-icons/fa';

import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    rollNumber: '',
    class: '',
    section: 'A',
    academicYear: new Date().getFullYear().toString(),
    parentName: '',
    parentPhone: '',
    address: '',
    dateOfBirth: '',
    gender: 'Male'
  });

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudents = async (page = 1) => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(
        `/admin/students?page=${page}&limit=10&search=${encodeURIComponent(search)}`
      );

      console.log('Students API response:', response.data);

      const responseData = response.data;

      /*
        Supports these common backend response formats:

        {
          data: {
            students: [],
            pagination: {}
          }
        }

        OR

        {
          students: [],
          pagination: {}
        }

        OR

        {
          data: []
        }
      */

      const studentList =
        responseData?.data?.students ||
        responseData?.students ||
        (Array.isArray(responseData?.data)
          ? responseData.data
          : []);

      const paginationData =
        responseData?.data?.pagination ||
        responseData?.pagination ||
        {};

      setStudents(Array.isArray(studentList) ? studentList : []);
      setPagination(paginationData);

    } catch (error) {
      console.error('Error fetching students:', error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to load students';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents(1);
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
      if (editingStudent) {
        await api.put(
          `/admin/students/${editingStudent._id}`,
          formData
        );

        toast.success('Student updated successfully');
      } else {
        await api.post('/admin/students', formData);

        toast.success('Student created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchStudents();

    } catch (error) {
      console.error('Student save error:', error);

      toast.error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Operation failed'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this student?'
      )
    ) {
      try {
        await api.delete(`/admin/students/${id}`);

        toast.success('Student deleted successfully');

        fetchStudents();

      } catch (error) {
        console.error('Delete error:', error);

        toast.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to delete student'
        );
      }
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt(
      'Enter new password (min 6 characters):'
    );

    if (newPassword && newPassword.length >= 6) {
      try {
        await api.put(
          `/admin/students/${id}/reset-password`,
          {
            newPassword
          }
        );

        toast.success('Password reset successfully');

      } catch (error) {
        console.error('Reset password error:', error);

        toast.error(
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to reset password'
        );
      }
    } else if (newPassword !== null) {
      toast.warning(
        'Password must be at least 6 characters'
      );
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      rollNumber: '',
      class: '',
      section: 'A',
      academicYear: new Date().getFullYear().toString(),
      parentName: '',
      parentPhone: '',
      address: '',
      dateOfBirth: '',
      gender: 'Male'
    });

    setEditingStudent(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);

    setFormData({
      name: student.user?.name || '',
      email: student.user?.email || '',
      phone: student.user?.phone || '',
      rollNumber: student.rollNumber || '',
      class: student.class || '',
      section: student.section || 'A',
      academicYear:
        student.academicYear ||
        new Date().getFullYear().toString(),
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
      address: student.address || '',
      dateOfBirth: student.dateOfBirth
        ? student.dateOfBirth.split('T')[0]
        : '',
      gender: student.gender || 'Male',
      username: student.user?.username || '',
      password: ''
    });

    setShowModal(true);
  };

  if (loading && students.length === 0) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />

        <p className="mt-3">
          Loading students...
        </p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Student Management</h2>

            <Button
              variant="primary"
              onClick={openCreateModal}
            >
              <FaPlus className="me-2" />
              Add Student
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Form
                onSubmit={handleSearch}
                className="d-flex gap-2"
              >
                <Form.Control
                  type="text"
                  placeholder="Search by name, roll number, or class..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

                <Button
                  type="submit"
                  variant="outline-primary"
                >
                  <FaSearch />
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Students Table */}
          <Card className="shadow-sm">
            <Card.Body>

              {error && (
                <Alert
                  variant="danger"
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>{error}</span>

                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => fetchStudents(1)}
                  >
                    Retry
                  </Button>
                </Alert>
              )}

              <div className="table-responsive">
                <Table striped hover>

                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Roll No</th>
                      <th>Class</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {students.length > 0 ? (
                      students.map((student, index) => (

                        <tr key={student._id}>

                          <td>{index + 1}</td>

                          <td>
                            <div className="d-flex align-items-center">

                              <img
                                src={
                                  student.user?.profilePicture ||
                                  'https://via.placeholder.com/40'
                                }
                                alt={
                                  student.user?.name || 'Student'
                                }
                                className="rounded-circle me-2"
                                width={40}
                                height={40}
                              />

                              <div>
                                <div className="fw-bold">
                                  {student.user?.name ||
                                    'N/A'}
                                </div>

                                <small className="text-muted">
                                  @
                                  {student.user?.username ||
                                    'N/A'}
                                </small>
                              </div>

                            </div>
                          </td>

                          <td>
                            {student.rollNumber || 'N/A'}
                          </td>

                          <td>
                            {student.class || 'N/A'}
                            {student.section
                              ? `-${student.section}`
                              : ''}
                          </td>

                          <td>
                            {student.user?.email || 'N/A'}
                          </td>

                          <td>
                            {student.user?.phone || 'N/A'}
                          </td>

                          <td>
                            <Badge
                              bg={
                                student.user?.isActive
                                  ? 'success'
                                  : 'danger'
                              }
                            >
                              {student.user?.isActive
                                ? 'Active'
                                : 'Inactive'}
                            </Badge>
                          </td>

                          <td>

                            <div className="d-flex gap-2">

                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() =>
                                  openEditModal(student)
                                }
                              >
                                <FaEdit />
                              </Button>

                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() =>
                                  handleResetPassword(
                                    student._id
                                  )
                                }
                              >
                                <FaKey />
                              </Button>

                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() =>
                                  handleDelete(
                                    student._id
                                  )
                                }
                              >
                                <FaTrash />
                              </Button>

                            </div>

                          </td>

                        </tr>

                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center py-4 text-muted"
                        >
                          No students found
                        </td>
                      </tr>
                    )}

                  </tbody>

                </Table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">

                  <span className="text-muted">
                    Showing {students.length} of{' '}
                    {pagination.total || 0} students
                  </span>

                  <Pagination>

                    <Pagination.Prev
                      onClick={() =>
                        fetchStudents(
                          pagination.page - 1
                        )
                      }
                      disabled={
                        pagination.page === 1
                      }
                    />

                    {[
                      ...Array(pagination.pages)
                    ].map((_, i) => (

                      <Pagination.Item
                        key={i + 1}
                        active={
                          i + 1 === pagination.page
                        }
                        onClick={() =>
                          fetchStudents(i + 1)
                        }
                      >
                        {i + 1}
                      </Pagination.Item>

                    ))}

                    <Pagination.Next
                      onClick={() =>
                        fetchStudents(
                          pagination.page + 1
                        )
                      }
                      disabled={
                        pagination.page ===
                        pagination.pages
                      }
                    />

                  </Pagination>

                </div>
              )}

            </Card.Body>
          </Card>

        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
      >

        <Modal.Header closeButton>
          <Modal.Title>
            {editingStudent
              ? 'Edit Student'
              : 'Add New Student'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>

          <Modal.Body>

            <Row>

              <Col md={6}>
                <Form.Group className="mb-3">

                  <Form.Label>
                    <FaUser className="me-2" />
                    Full Name *
                  </Form.Label>

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

                  <Form.Label>
                    <FaEnvelope className="me-2" />
                    Email *
                  </Form.Label>

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

            {!editingStudent && (
              <Row>

                <Col md={6}>
                  <Form.Group className="mb-3">

                    <Form.Label>
                      <FaUser className="me-2" />
                      Username *
                    </Form.Label>

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

                    <Form.Label>
                      <FaKey className="me-2" />
                      Password *
                    </Form.Label>

                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />

                  </Form.Group>
                </Col>

              </Row>
            )}

            <Row>

              <Col md={6}>
                <Form.Group className="mb-3">

                  <Form.Label>
                    <FaPhone className="me-2" />
                    Phone
                  </Form.Label>

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

                  <Form.Label>
                    <FaIdCard className="me-2" />
                    Roll Number *
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
                  />

                </Form.Group>
              </Col>

            </Row>

            <Row>

              <Col md={6}>
                <Form.Group className="mb-3">

                  <Form.Label>
                    <FaGraduationCap className="me-2" />
                    Class *
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    required
                  />

                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">

                  <Form.Label>
                    Section
                  </Form.Label>

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

            <Row>

              <Col md={6}>
                <Form.Group className="mb-3">

                  <Form.Label>
                    Parent's Name
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                  />

                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">

                  <Form.Label>
                    Parent's Phone
                  </Form.Label>

                  <Form.Control
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleChange}
                  />

                </Form.Group>
              </Col>

            </Row>

            <Row>

              <Col md={6}>
                <Form.Group className="mb-3">

                  <Form.Label>
                    Date of Birth
                  </Form.Label>

                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />

                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">

                  <Form.Label>
                    Gender
                  </Form.Label>

                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </Form.Select>

                </Form.Group>
              </Col>

            </Row>

            <Form.Group className="mb-3">

              <Form.Label>
                Address
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
              />

            </Form.Group>

          </Modal.Body>

          <Modal.Footer>

            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : editingStudent
                  ? 'Update'
                  : 'Create'}
            </Button>

          </Modal.Footer>

        </Form>

      </Modal>

    </Container>
  );
};

export default AdminStudents;
