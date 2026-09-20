import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  Badge,
  Table,
  Modal
} from 'react-bootstrap';

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserTie,
  FaBook,
  FaUsers,
  FaSchool
} from 'react-icons/fa';

import axios from 'axios';
import { toast } from 'react-toastify';

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false);

  const [formData, setFormData] = useState({
    className: '',
    section: 'A',
    classTeacher: '',
    academicYear: new Date().getFullYear().toString(),
    roomNumber: '',
    maxStudents: 50,
    description: ''
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
    fetchSubjects();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);

      const response = await axios.get('/api/admin/classes');

      setClasses(response.data.data || []);
      setError('');
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(
        '/api/admin/teachers?limit=100'
      );

      setTeachers(
        response.data.data?.teachers || []
      );
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        '/api/admin/subjects'
      );

      setSubjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
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
      let classId;

      if (editingClass) {
        const response = await axios.put(
          `/api/admin/classes/${editingClass._id}`,
          {
            className: formData.className,
            section: formData.section,
            academicYear: formData.academicYear,
            roomNumber: formData.roomNumber,
            maxStudents: Number(formData.maxStudents),
            description: formData.description
          }
        );

        classId =
          response.data.data?._id ||
          editingClass._id;

        if (formData.classTeacher) {
          await axios.put(
            `/api/admin/classes/${classId}/assign-teacher`,
            {
              teacherId: formData.classTeacher
            }
          );
        }

        toast.success(
          'Class updated successfully'
        );
      } else {
        const response = await axios.post(
          '/api/admin/classes',
          {
            className: formData.className,
            section: formData.section,
            academicYear: formData.academicYear,
            roomNumber: formData.roomNumber,
            maxStudents: Number(formData.maxStudents),
            description: formData.description
          }
        );

        classId =
          response.data.data?._id;

        if (
          classId &&
          formData.classTeacher
        ) {
          await axios.put(
            `/api/admin/classes/${classId}/assign-teacher`,
            {
              teacherId: formData.classTeacher
            }
          );
        }

        toast.success(
          'Class created successfully'
        );
      }

      setShowModal(false);
      resetForm();
      await fetchClasses();
    } catch (error) {
      console.error(
        'Class submit error:',
        error
      );

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
        'Are you sure you want to delete this class?'
      )
    ) {
      try {
        await axios.delete(
          `/api/admin/classes/${id}`
        );

        toast.success(
          'Class deleted successfully'
        );

        fetchClasses();
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            'Failed to delete class'
        );
      }
    }
  };

  const handleAddSubject = async (subjectId) => {
    try {
      await axios.post(
        `/api/admin/classes/${selectedClass._id}/subjects`,
        {
          subjectId
        }
      );

      toast.success(
        'Subject added successfully'
      );

      await fetchClasses();

      const response = await axios.get(
        '/api/admin/classes'
      );

      const updatedClass =
        response.data.data?.find(
          (item) =>
            item._id === selectedClass._id
        );

      if (updatedClass) {
        setSelectedClass(updatedClass);
      }

      setShowSubjectModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to add subject'
      );
    }
  };

  const handleRemoveSubject = async (
    subjectId
  ) => {
    if (
      window.confirm(
        'Remove this subject from class?'
      )
    ) {
      try {
        await axios.delete(
          `/api/admin/classes/${selectedClass._id}/subjects/${subjectId}`
        );

        toast.success(
          'Subject removed successfully'
        );

        await fetchClasses();

        const response = await axios.get(
          '/api/admin/classes'
        );

        const updatedClass =
          response.data.data?.find(
            (item) =>
              item._id ===
              selectedClass._id
          );

        if (updatedClass) {
          setSelectedClass(updatedClass);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            'Failed to remove subject'
        );
      }
    }
  };

  const resetForm = () => {
    setFormData({
      className: '',
      section: 'A',
      classTeacher: '',
      academicYear:
        new Date().getFullYear().toString(),
      roomNumber: '',
      maxStudents: 50,
      description: ''
    });

    setEditingClass(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (classData) => {
    setEditingClass(classData);

    setFormData({
      className:
        classData.className || '',
      section:
        classData.section || 'A',
      classTeacher:
        classData.classTeacher?._id ||
        classData.classTeacher ||
        '',
      academicYear:
        classData.academicYear || '',
      roomNumber:
        classData.roomNumber || '',
      maxStudents:
        classData.maxStudents || 50,
      description:
        classData.description || ''
    });

    setShowModal(true);
  };

  const openSubjectModal = (classData) => {
    setSelectedClass(classData);
    setShowSubjectModal(true);
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />

        <p className="mt-3">
          Loading classes...
        </p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Class Management</h2>

            <Button
              variant="primary"
              onClick={openCreateModal}
            >
              <FaPlus className="me-2" />
              Add Class
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
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Class</th>
                      <th>Section</th>
                      <th>Class Teacher</th>
                      <th>Students</th>
                      <th>Subjects</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {classes.map(
                      (classData, index) => (
                        <tr
                          key={
                            classData._id
                          }
                        >
                          <td>
                            {index + 1}
                          </td>

                          <td>
                            <div className="d-flex align-items-center">
                              <FaSchool className="me-2 text-primary" />

                              <span className="fw-bold">
                                {
                                  classData.className
                                }
                              </span>
                            </div>
                          </td>

                          <td>
                            <Badge bg="info">
                              Section{' '}
                              {
                                classData.section
                              }
                            </Badge>
                          </td>

                          <td>
                            {classData.classTeacher ? (
                              <div className="d-flex align-items-center">
                                <FaUserTie className="me-1 text-success" />

                                {classData
                                  .classTeacher
                                  ?.name ||
                                  classData.classTeacherName ||
                                  'Assigned'}
                              </div>
                            ) : (
                              <Badge bg="warning">
                                Not Assigned
                              </Badge>
                            )}
                          </td>

                          <td>
                            <div className="d-flex align-items-center">
                              <FaUsers className="me-1" />

                              {
                                classData.totalStudents ||
                                0
                              }

                              <small className="text-muted ms-1">
                                /{' '}
                                {
                                  classData.maxStudents
                                }
                              </small>
                            </div>
                          </td>

                          <td>
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() =>
                                openSubjectModal(
                                  classData
                                )
                              }
                            >
                              <FaBook className="me-1" />

                              {classData
                                .subjects
                                ?.length ||
                                0}{' '}
                              Subjects
                            </Button>
                          </td>

                          <td>
                            <Badge
                              bg={
                                classData.isActive
                                  ? 'success'
                                  : 'danger'
                              }
                            >
                              {classData.isActive
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
                                  openEditModal(
                                    classData
                                  )
                                }
                              >
                                <FaEdit />
                              </Button>

                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() =>
                                  handleDelete(
                                    classData._id
                                  )
                                }
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
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={() =>
          setShowModal(false)
        }
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingClass
              ? 'Edit Class'
              : 'Add New Class'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Class Name *
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="className"
                    value={
                      formData.className
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="e.g., Class 10"
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
                    value={
                      formData.section
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="A">
                      A
                    </option>

                    <option value="B">
                      B
                    </option>

                    <option value="C">
                      C
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Class Teacher
                  </Form.Label>

                  <Form.Select
                    name="classTeacher"
                    value={
                      formData.classTeacher
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="">
                      Select Teacher
                    </option>

                    {teachers.map(
                      (teacher) => (
                        <option
                          key={
                            teacher._id
                          }
                          value={
                            teacher.user?._id ||
                            teacher.user
                          }
                        >
                          {teacher.user
                            ?.name ||
                            'Unknown Teacher'}{' '}
                          (
                          {
                            teacher.employeeId
                          }
                          )
                        </option>
                      )
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Academic Year
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="academicYear"
                    value={
                      formData.academicYear
                    }
                    onChange={
                      handleChange
                    }
                    required
                    placeholder="2024-2025"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Room Number
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="roomNumber"
                    value={
                      formData.roomNumber
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g., Room 101"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Maximum Students
                  </Form.Label>

                  <Form.Control
                    type="number"
                    name="maxStudents"
                    value={
                      formData.maxStudents
                    }
                    onChange={
                      handleChange
                    }
                    min="1"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>
                Description
              </Form.Label>

              <Form.Control
                as="textarea"
                rows={2}
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Brief description of the class"
              />
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
                : editingClass
                ? 'Update'
                : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={showSubjectModal}
        onHide={() =>
          setShowSubjectModal(false)
        }
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Manage Subjects -{' '}
            {selectedClass?.className}{' '}
            Section{' '}
            {selectedClass?.section}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3">
            <Form.Label>
              Add Subject
            </Form.Label>

            <div className="d-flex gap-2">
              <Form.Select
                id="subjectSelect"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddSubject(
                      e.target.value
                    );

                    e.target.value =
                      '';
                  }
                }}
              >
                <option value="">
                  Select a subject to add...
                </option>

                {subjects
                  .filter(
                    (s) =>
                      !selectedClass?.subjects?.some(
                        (sub) =>
                          sub.subject?._id ===
                          s._id
                      )
                  )
                  .map(
                    (subject) => (
                      <option
                        key={
                          subject._id
                        }
                        value={
                          subject._id
                        }
                      >
                        {subject.name} (
                        {
                          subject.code
                        }
                        )
                      </option>
                    )
                  )}
              </Form.Select>
            </div>
          </div>

          <Table striped hover>
            <thead>
              <tr>
                <th>
                  Subject Name
                </th>
                <th>Code</th>
                <th>Teacher</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {selectedClass?.subjects?.map(
                (subject, index) => (
                  <tr key={index}>
                    <td>
                      {subject.name}
                    </td>

                    <td>
                      <Badge bg="info">
                        {
                          subject.code
                        }
                      </Badge>
                    </td>

                    <td>
                      {subject.teacherName ||
                        'Not Assigned'}
                    </td>

                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          handleRemoveSubject(
                            subject
                              .subject?._id ||
                              subject._id
                          )
                        }
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              setShowSubjectModal(
                false
              )
            }
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminClasses;