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
  Badge
} from 'react-bootstrap';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserTie,
  FaBook
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    class: '',
    section: 'A',
    teacher: '',
    academicYear: new Date().getFullYear().toString(),
    totalMarks: 100,
    passingMarks: 33,
    theoryMarks: 70,
    practicalMarks: 30
  });

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/admin/subjects');

      setSubjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);

      setError(
        error.response?.data?.message ||
        'Failed to load subjects'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get(
        '/api/admin/teachers?limit=100'
      );

      const teacherData =
        response.data?.data?.teachers ||
        response.data?.data ||
        [];

      setTeachers(teacherData);

      console.log('Teachers loaded:', teacherData);
    } catch (error) {
      console.error('Error fetching teachers:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to load teachers'
      );

      setTeachers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Subject name is required');
      return;
    }

    if (!formData.code.trim()) {
      toast.error('Subject code is required');
      return;
    }

    if (!formData.class.trim()) {
      toast.error('Class is required');
      return;
    }

    if (!formData.academicYear.trim()) {
      toast.error('Academic year is required');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        class: formData.class.trim(),
        section: formData.section || 'A',
        academicYear: formData.academicYear.trim(),
        teacher: formData.teacher || undefined,
        totalMarks: Number(formData.totalMarks),
        passingMarks: Number(formData.passingMarks),
        theoryMarks: Number(formData.theoryMarks),
        practicalMarks: Number(formData.practicalMarks)
      };

      console.log('Subject payload:', payload);

      if (editingSubject) {
        await api.put(
          `/api/admin/subjects/${editingSubject._id}`,
          payload
        );

        toast.success('Subject updated successfully');
      } else {
        await api.post(
          '/api/admin/subjects',
          payload
        );

        toast.success('Subject created successfully');
      }

      setShowModal(false);
      resetForm();
      await fetchSubjects();

    } catch (error) {
      console.error(
        'Subject save error:',
        error.response?.data || error
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
      !window.confirm(
        'Are you sure you want to delete this subject?'
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/api/admin/subjects/${id}`
      );

      toast.success(
        'Subject deleted successfully'
      );

      await fetchSubjects();

    } catch (error) {
      console.error(
        'Delete subject error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to delete subject'
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      class: '',
      section: 'A',
      teacher: '',
      academicYear:
        new Date().getFullYear().toString(),
      totalMarks: 100,
      passingMarks: 33,
      theoryMarks: 70,
      practicalMarks: 30
    });

    setEditingSubject(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);

    setFormData({
      name: subject.name || '',
      code: subject.code || '',
      description: subject.description || '',
      class: subject.class || '',
      section: subject.section || 'A',
      teacher:
        subject.teacher?._id ||
        subject.teacher ||
        '',
      academicYear:
        subject.academicYear ||
        new Date().getFullYear().toString(),
      totalMarks:
        subject.totalMarks ?? 100,
      passingMarks:
        subject.passingMarks ?? 33,
      theoryMarks:
        subject.theoryMarks ?? 70,
      practicalMarks:
        subject.practicalMarks ?? 30
    });

    setShowModal(true);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" />
          <p className="mt-3">
            Loading subjects...
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">

      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="mb-1">
                <FaBook className="me-2 text-primary" />
                Subject Management
              </h3>

              <small className="text-muted">
                Manage subjects and assign teachers
              </small>
            </div>

            <Button
              variant="primary"
              onClick={openCreateModal}
            >
              <FaPlus className="me-2" />
              Add Subject
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">

            <Card.Body>

              {error && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              <div className="table-responsive">

                <Table
                  striped
                  hover
                  responsive
                  className="align-middle"
                >

                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Subject</th>
                      <th>Code</th>
                      <th>Class</th>
                      <th>Teacher</th>
                      <th>Marks</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {subjects.length === 0 ? (
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center py-4"
                        >
                          No subjects found
                        </td>
                      </tr>
                    ) : (
                      subjects.map(
                        (subject, index) => (
                          <tr key={subject._id}>

                            <td>
                              {index + 1}
                            </td>

                            <td>
                              <div className="d-flex align-items-center">

                                <FaBook className="me-2 text-primary" />

                                <div>
                                  <div className="fw-bold">
                                    {subject.name}
                                  </div>

                                  {subject.description && (
                                    <small className="text-muted">
                                      {subject.description.substring(
                                        0,
                                        30
                                      )}
                                    </small>
                                  )}
                                </div>

                              </div>
                            </td>

                            <td>
                              <Badge bg="info">
                                {subject.code}
                              </Badge>
                            </td>

                            <td>
                              {subject.class}-
                              {subject.section}
                            </td>

                            <td>

                              {subject.teacher ? (
                                <div className="d-flex align-items-center">

                                  <FaUserTie className="me-1 text-success" />

                                  {subject.teacher.name ||
                                    subject.teacherName ||
                                    'Teacher'}

                                </div>
                              ) : (
                                <Badge bg="warning">
                                  Not Assigned
                                </Badge>
                              )}

                            </td>

                            <td>
                              <small>
                                Total:{' '}
                                {subject.totalMarks}
                                <br />

                                Passing:{' '}
                                {subject.passingMarks}
                              </small>
                            </td>

                            <td>
                              <Badge
                                bg={
                                  subject.isActive
                                    ? 'success'
                                    : 'danger'
                                }
                              >
                                {subject.isActive
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
                                    openEditModal(subject)
                                  }
                                >
                                  <FaEdit />
                                </Button>

                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() =>
                                    handleDelete(
                                      subject._id
                                    )
                                  }
                                >
                                  <FaTrash />
                                </Button>

                              </div>

                            </td>

                          </tr>
                        )
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
        onHide={() => {
          if (!submitting) {
            setShowModal(false);
          }
        }}
        size="lg"
        centered
      >

        <Modal.Header closeButton>
          <Modal.Title>
            {editingSubject
              ? 'Edit Subject'
              : 'Add New Subject'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>

          <Modal.Body>

            <Row>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Subject Name *
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Mathematics"
                  />

                </Form.Group>

              </Col>

              <Col md={6}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Subject Code *
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    required
                    placeholder="e.g., MATH101"
                    style={{
                      textTransform: 'uppercase'
                    }}
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
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the subject"
              />

            </Form.Group>

            <Row>

              <Col md={4}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Class *
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 10"
                  />

                </Form.Group>

              </Col>

              <Col md={4}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Section
                  </Form.Label>

                  <Form.Select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
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

              <Col md={4}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Academic Year *
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="academicYear"
                    value={
                      formData.academicYear
                    }
                    onChange={handleChange}
                    required
                    placeholder="2026-2027"
                  />

                </Form.Group>

              </Col>

            </Row>

            <Form.Group className="mb-3">

              <Form.Label>
                Assign Teacher
              </Form.Label>

              <Form.Select
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
              >

                <option value="">
                  Select Teacher
                </option>

                {teachers.map((teacher) => {

                  const userId =
                    teacher.user?._id;

                  return (
                    <option
                      key={teacher._id}
                      value={userId || ''}
                      disabled={!userId}
                    >
                      {teacher.user?.name ||
                        'Unknown Teacher'}
                      {' '}
                      (
                      {teacher.employeeId ||
                        'No Employee ID'}
                      )
                    </option>
                  );
                })}

              </Form.Select>

              {teachers.length === 0 && (
                <Form.Text className="text-danger">
                  No teachers available.
                </Form.Text>
              )}

            </Form.Group>

            <Row>

              <Col md={4}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Total Marks
                  </Form.Label>

                  <Form.Control
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    min="0"
                  />

                </Form.Group>

              </Col>

              <Col md={4}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Passing Marks
                  </Form.Label>

                  <Form.Control
                    type="number"
                    name="passingMarks"
                    value={
                      formData.passingMarks
                    }
                    onChange={handleChange}
                    min="0"
                  />

                </Form.Group>

              </Col>

              <Col md={4}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Theory Marks
                  </Form.Label>

                  <Form.Control
                    type="number"
                    name="theoryMarks"
                    value={
                      formData.theoryMarks
                    }
                    onChange={handleChange}
                    min="0"
                  />

                </Form.Group>

              </Col>

            </Row>

            <Row>

              <Col md={4}>

                <Form.Group className="mb-3">

                  <Form.Label>
                    Practical Marks
                  </Form.Label>

                  <Form.Control
                    type="number"
                    name="practicalMarks"
                    value={
                      formData.practicalMarks
                    }
                    onChange={handleChange}
                    min="0"
                  />

                </Form.Group>

              </Col>

            </Row>

          </Modal.Body>

          <Modal.Footer>

            <Button
              variant="secondary"
              onClick={() =>
                setShowModal(false)
              }
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
            >

              {submitting ? (
                <>
                  <Spinner
                    size="sm"
                    animation="border"
                    className="me-2"
                  />
                  Saving...
                </>
              ) : (
                editingSubject
                  ? 'Update'
                  : 'Create'
              )}

            </Button>

          </Modal.Footer>

        </Form>

      </Modal>

    </Container>
  );
};

export default AdminSubjects;