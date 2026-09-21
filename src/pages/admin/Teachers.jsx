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
  FaKey,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaBuilding,
  FaCalendarAlt,
  FaVenusMars,
  FaMapMarkerAlt,
  FaBriefcase
} from 'react-icons/fa';

import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningTeacher, setAssigningTeacher] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [assigning, setAssigning] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    employeeId: '',
    qualification: '',
    specialization: '',
    department: 'Other',
    experience: 0,
    previousInstitution: '',
    dateOfBirth: '',
    gender: 'Other',
    address: '',
    subjects: []
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, []);

  const fetchTeachers = async (page = 1) => {
    try {
      setLoading(true);

      const response = await api.get(
        `/api/admin/teachers?page=${page}&limit=10`
      );

      setTeachers(response.data.data.teachers);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setError('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/admin/classes');
      setClasses(response.data.data || []);
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
      const addressData = formData.address
        ? { street: formData.address }
        : {};

      const formattedSubjects = Array.isArray(formData.subjects)
        ? formData.subjects
            .map((subject) => {
              if (typeof subject === 'string') {
                return {
                  name: subject,
                  isActive: true
                };
              }

              return subject;
            })
            .filter((subject) => subject.name)
        : [];

      const submitData = {
        ...formData,
        address: addressData,
        experience: parseInt(formData.experience, 10) || 0,
        subjects: formattedSubjects
      };

      if (editingTeacher) {
        delete submitData.username;
        delete submitData.password;

        await api.put(
          `/api/admin/teachers/${editingTeacher._id}`,
          submitData
        );

        toast.success('Teacher updated successfully');
      } else {
        await api.post(
          '/api/admin/teachers',
          submitData
        );

        toast.success('Teacher created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchTeachers();
    } catch (error) {
      console.error('Teacher submit error:', error);

      toast.error(
        error.response?.data?.message ||
          'Operation failed'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this teacher?'
      )
    ) {
      try {
        await api.delete(
          `/api/admin/teachers/${id}`
        );

        toast.success(
          'Teacher deleted successfully'
        );

        fetchTeachers();
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            'Failed to delete teacher'
        );
      }
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt(
      'Enter new password (min 6 characters):'
    );

    if (
      newPassword &&
      newPassword.length >= 6
    ) {
      try {
        await api.put(
          `/api/admin/teachers/${id}/reset-password`,
          { newPassword }
        );

        toast.success(
          'Password reset successfully'
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
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
      employeeId: '',
      qualification: '',
      specialization: '',
      department: 'Other',
      experience: 0,
      previousInstitution: '',
      dateOfBirth: '',
      gender: 'Other',
      address: '',
      subjects: []
    });

    setEditingTeacher(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (teacher) => {
    setEditingTeacher(teacher);

    setFormData({
      name: teacher.user?.name || '',
      email: teacher.user?.email || '',
      phone: teacher.user?.phone || '',
      employeeId: teacher.employeeId || '',
      qualification: teacher.qualification || '',
      specialization: teacher.specialization || '',
      department: teacher.department || 'Other',
      experience: teacher.experience || 0,
      previousInstitution:
        teacher.previousInstitution || '',
      dateOfBirth: teacher.dateOfBirth
        ? teacher.dateOfBirth.split('T')[0]
        : '',
      gender: teacher.gender || 'Other',
      address: teacher.address?.street || '',
      subjects: Array.isArray(teacher.subjects)
        ? teacher.subjects.map(
            (subject) => subject.name || ''
          )
        : [],
      username: teacher.user?.username || '',
      password: ''
    });

    setShowModal(true);
  };

  const openAssignModal = (teacher) => {
    setAssigningTeacher(teacher);
    setSelectedClass('');
    setShowAssignModal(true);
  };

  const handleAssignClass = async (e) => {
    e.preventDefault();

    if (!selectedClass || !assigningTeacher) {
      toast.warning('Please select a class');
      return;
    }

    try {
      setAssigning(true);

      const teacherUserId =
        assigningTeacher.user?._id;

      if (!teacherUserId) {
        toast.error(
          'Teacher user reference not found'
        );
        return;
      }

      await api.put(
        `/api/admin/classes/${selectedClass}/assign-teacher`,
        {
          teacherId: teacherUserId
        }
      );

      toast.success(
        'Class teacher assigned successfully'
      );

      setShowAssignModal(false);
      setAssigningTeacher(null);
      setSelectedClass('');

      fetchClasses();
      fetchTeachers();
    } catch (error) {
      console.error(
        'Assign class error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to assign class teacher'
      );
    } finally {
      setAssigning(false);
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      Science: 'primary',
      Commerce: 'success',
      Arts: 'info',
      Engineering: 'warning',
      Medical: 'danger',
      Other: 'secondary'
    };

    return (
      colors[department] ||
      'secondary'
    );
  };

  const getGenderBadge = (gender) => {
    const colors = {
      Male: 'primary',
      Female: 'danger',
      Other: 'secondary'
    };

    return (
      colors[gender] ||
      'secondary'
    );
  };

  if (
    loading &&
    teachers.length === 0
  ) {
    return (
      <Container className="text-center py-5">
        <Spinner
          animation="border"
          variant="primary"
        />

        <p className="mt-3">
          Loading teachers...
        </p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Teacher Management</h2>

            <Button
              variant="primary"
              onClick={openCreateModal}
            >
              <FaPlus className="me-2" />
              Add Teacher
            </Button>
          </div>

          <Card className="shadow-sm">
            <Card.Body>
              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}

              <div className="table-responsive">
                <Table
                  striped
                  hover
                >
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Qualification</th>
                      <th>Experience</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {teachers.map(
                      (teacher, index) => (
                        <tr
                          key={
                            teacher._id
                          }
                        >
                          <td>
                            {index + 1}
                          </td>

                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  teacher.user
                                    ?.profilePicture ||
                                  'https://via.placeholder.com/40'
                                }
                                alt={
                                  teacher.user
                                    ?.name
                                }
                                className="rounded-circle me-2"
                                width={40}
                                height={40}
                              />

                              <div>
                                <div className="fw-bold">
                                  {
                                    teacher
                                      .user
                                      ?.name
                                  }
                                </div>

                                <small className="text-muted">
                                  @
                                  {
                                    teacher
                                      .user
                                      ?.username
                                  }
                                </small>

                                <br />

                                <Badge
                                  bg={getGenderBadge(
                                    teacher.gender
                                  )}
                                  className="mt-1"
                                >
                                  {teacher.gender ||
                                    'Other'}
                                </Badge>
                              </div>
                            </div>
                          </td>

                          <td>
                            <Badge bg="dark">
                              {
                                teacher.employeeId
                              }
                            </Badge>
                          </td>

                          <td>
                            <Badge
                              bg={getDepartmentColor(
                                teacher.department
                              )}
                            >
                              {teacher.department ||
                                'Other'}
                            </Badge>
                          </td>

                          <td>
                            {
                              teacher.qualification ||
                              'N/A'
                            }
                          </td>

                          <td>
                            {teacher.experience >
                            0 ? (
                              <Badge bg="info">
                                {
                                  teacher.experience
                                }{' '}
                                {teacher.experience ===
                                1
                                  ? 'Year'
                                  : 'Years'}
                              </Badge>
                            ) : (
                              <Badge bg="secondary">
                                Fresher
                              </Badge>
                            )}
                          </td>

                          <td>
                            {
                              teacher.user
                                ?.email
                            }
                          </td>

                          <td>
                            <Badge
                              bg={
                                teacher.user
                                  ?.isActive
                                  ? 'success'
                                  : 'danger'
                              }
                            >
                              {teacher.user
                                ?.isActive
                                ? 'Active'
                                : 'Inactive'}
                            </Badge>
                          </td>

                          <td>
                            <div className="d-flex gap-2 flex-wrap">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() =>
                                  openEditModal(
                                    teacher
                                  )
                                }
                                title="Edit Teacher"
                              >
                                <FaEdit />
                              </Button>

                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() =>
                                  openAssignModal(
                                    teacher
                                  )
                                }
                                title="Assign Class"
                              >
                                <FaChalkboardTeacher />
                              </Button>

                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() =>
                                  handleResetPassword(
                                    teacher._id
                                  )
                                }
                                title="Reset Password"
                              >
                                <FaKey />
                              </Button>

                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() =>
                                  handleDelete(
                                    teacher._id
                                  )
                                }
                                title="Delete Teacher"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </Table>
              </div>

              {pagination.pages >
                1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="text-muted">
                    Showing{' '}
                    {teachers.length} of{' '}
                    {pagination.total}{' '}
                    teachers
                  </span>

                  <Pagination>
                    <Pagination.Prev
                      onClick={() =>
                        fetchTeachers(
                          pagination.page -
                            1
                        )
                      }
                      disabled={
                        pagination.page ===
                        1
                      }
                    />

                    {[
                      ...Array(
                        pagination.pages
                      )
                    ].map(
                      (_, i) => (
                        <Pagination.Item
                          key={
                            i + 1
                          }
                          active={
                            i + 1 ===
                            pagination.page
                          }
                          onClick={() =>
                            fetchTeachers(
                              i + 1
                            )
                          }
                        >
                          {i + 1}
                        </Pagination.Item>
                      )
                    )}

                    <Pagination.Next
                      onClick={() =>
                        fetchTeachers(
                          pagination.page +
                            1
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

      <Modal
        show={showModal}
        onHide={() =>
          setShowModal(false)
        }
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTeacher
              ? 'Edit Teacher'
              : 'Add New Teacher'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <h6 className="text-primary mb-3">
              <FaUser className="me-2" />
              Personal Information
            </h6>

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
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Enter full name"
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
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="Enter email address"
                  />
                </Form.Group>
              </Col>
            </Row>

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
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter phone number"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaVenusMars className="me-2" />
                    Gender
                  </Form.Label>

                  <Form.Select
                    name="gender"
                    value={
                      formData.gender
                    }
                    onChange={
                      handleChange
                    }
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

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaCalendarAlt className="me-2" />
                    Date of Birth
                  </Form.Label>

                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={
                      formData.dateOfBirth
                    }
                    onChange={
                      handleChange
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaMapMarkerAlt className="me-2" />
                    Address
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Street, City, State"
                  />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="text-primary mt-4 mb-3">
              <FaKey className="me-2" />
              Account Information
            </h6>

            {!editingTeacher && (
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
                      value={
                        formData.username
                      }
                      onChange={
                        handleChange
                      }
                      required
                      placeholder="Choose a username"
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
                      value={
                        formData.password
                      }
                      onChange={
                        handleChange
                      }
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            <h6 className="text-primary mt-4 mb-3">
              <FaChalkboardTeacher className="me-2" />
              Professional Information
            </h6>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaChalkboardTeacher className="me-2" />
                    Employee ID *
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="employeeId"
                    value={
                      formData.employeeId
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="e.g., EMP001"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaBuilding className="me-2" />
                    Department
                  </Form.Label>

                  <Form.Select
                    name="department"
                    value={
                      formData.department
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="Other">
                      Other
                    </option>
                    <option value="Science">
                      Science
                    </option>
                    <option value="Commerce">
                      Commerce
                    </option>
                    <option value="Arts">
                      Arts
                    </option>
                    <option value="Engineering">
                      Engineering
                    </option>
                    <option value="Medical">
                      Medical
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaGraduationCap className="me-2" />
                    Qualification
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="qualification"
                    value={
                      formData.qualification
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g., M.Sc. in Mathematics"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Specialization
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="specialization"
                    value={
                      formData.specialization
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g., Algebra, Calculus"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaBriefcase className="me-2" />
                    Experience (Years)
                  </Form.Label>

                  <Form.Control
                    type="number"
                    name="experience"
                    value={
                      formData.experience
                    }
                    onChange={
                      handleChange
                    }
                    min="0"
                    max="50"
                    placeholder="Years of experience"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Previous Institution
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="previousInstitution"
                    value={
                      formData.previousInstitution
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Previous school/college name"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>
                Subjects (comma separated)
              </Form.Label>

              <Form.Control
                type="text"
                name="subjects"
                value={
                  Array.isArray(
                    formData.subjects
                  )
                    ? formData.subjects
                        .map(
                          (subject) =>
                            typeof subject ===
                            'string'
                              ? subject
                              : subject.name ||
                                ''
                        )
                        .join(', ')
                    : ''
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subjects:
                      e.target.value
                        .split(',')
                        .map(
                          (s) =>
                            s.trim()
                        )
                        .filter(Boolean)
                  })
                }
                placeholder="Math, Science, English, Physics"
              />

              <Form.Text className="text-muted">
                Enter subjects separated by commas
              </Form.Text>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() =>
                setShowModal(false)
              }
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
                : editingTeacher
                ? 'Update Teacher'
                : 'Create Teacher'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={showAssignModal}
        onHide={() =>
          setShowAssignModal(false)
        }
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Assign Class Teacher
          </Modal.Title>
        </Modal.Header>

        <Form
          onSubmit={
            handleAssignClass
          }
        >
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                Teacher
              </Form.Label>

              <Form.Control
                type="text"
                value={
                  assigningTeacher
                    ?.user?.name || ''
                }
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Select Class
              </Form.Label>

              <Form.Select
                value={
                  selectedClass
                }
                onChange={(e) =>
                  setSelectedClass(
                    e.target.value
                  )
                }
                required
              >
                <option value="">
                  Select class
                </option>

                {classes.map(
                  (classItem) => (
                    <option
                      key={
                        classItem._id
                      }
                      value={
                        classItem._id
                      }
                    >
                      {
                        classItem.className
                      }{' '}
                      - Section{' '}
                      {
                        classItem.section
                      }
                      {classItem
                        .classTeacher
                        ?.name
                        ? ` (${classItem.classTeacher.name})`
                        : ''}
                    </option>
                  )
                )}
              </Form.Select>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() =>
                setShowAssignModal(
                  false
                )
              }
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={assigning}
            >
              {assigning
                ? 'Assigning...'
                : 'Assign Class'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminTeachers;