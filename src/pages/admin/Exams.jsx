import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Table, Badge, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const AdminExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    class: '',
    section: 'A',
    examName: '',
    examDate: '',
    teacher: '',
    academicYear: new Date().getFullYear().toString()
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExams();
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/exams');
      setExams(response.data.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/admin/classes');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/admin/teachers?limit=1000');
      setTeachers(response.data.data.teachers || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
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
      if (editingExam) {
        await api.put(`/admin/exams/${editingExam._id}`, {
          examName: formData.examName,
          examDate: formData.examDate,
          teacher: formData.teacher || null
        });
        toast.success('Exam updated successfully');
      } else {
        await api.post('/admin/exams', formData);
        toast.success('Exam created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchExams();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.put(`/admin/exams/${id}/publish`);
      toast.success('Result published successfully');
      fetchExams();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to publish result');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await api.delete(`/admin/exams/${id}`);
        toast.success('Exam deleted successfully');
        fetchExams();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete exam');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      class: '',
      section: 'A',
      examName: '',
      examDate: '',
      teacher: '',
      academicYear: new Date().getFullYear().toString()
    });
    setEditingExam(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (exam) => {
    setEditingExam(exam);
    setFormData({
      class: exam.class,
      section: exam.section,
      examName: exam.examName,
      examDate: exam.examDate ? exam.examDate.split('T')[0] : '',
      teacher: exam.teacher?._id || exam.teacher || '',
      academicYear: exam.academicYear
    });
    setShowModal(true);
  };

  const getTeacherName = (exam) => {
    if (exam.teacher?.user?.name) return exam.teacher.user.name;
    if (exam.teacher?.name) return exam.teacher.name;
    const t = teachers.find(t => (t._id === exam.teacher || t.user?._id === exam.teacher));
    return t?.user?.name || '-';
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading exams...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Exam Management</h2>
            <Button variant="primary" onClick={openCreateModal}>
              <FaPlus className="me-2" /> Create Exam
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
                      <th>Class</th>
                      <th>Exam Name</th>
                      <th>Date</th>
                      <th>Teacher</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((exam, index) => (
                      <tr key={exam._id}>
                        <td>{index + 1}</td>
                        <td>{exam.class}-{exam.section}</td>
                        <td>{exam.examName}</td>
                        <td>{moment(exam.examDate).format('DD MMM YYYY')}</td>
                        <td>{getTeacherName(exam)}</td>
                        <td>
                          <Badge bg={exam.published ? 'success' : 'warning'}>
                            {exam.published ? 'Published' : 'Draft'}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => openEditModal(exam)}
                            >
                              <FaEdit />
                            </Button>
                            {!exam.published && (
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handlePublish(exam._id)}
                              >
                                <FaCheck />
                              </Button>
                            )}
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(exam._id)}
                              disabled={exam.published}
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
            {editingExam ? 'Edit Exam' : 'Create New Exam'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {!editingExam && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Class</Form.Label>
                    <Form.Select
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Class</option>
                      {classes.map(cls => (
                        <option key={cls._id} value={cls.className}>
                          {cls.className} - {cls.section}
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
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Exam Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="examName"
                    value={formData.examName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Mid Term Exam"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Exam Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="examDate"
                    value={formData.examDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Assign Teacher</Form.Label>
                  <Form.Select
                    name="teacher"
                    value={formData.teacher}
                    onChange={handleChange}
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(t => (
                      <option key={t._id} value={t.user?._id || t._id}>
                        {t.user?.name} ({t.employeeId})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : (editingExam ? 'Update' : 'Create')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminExams;