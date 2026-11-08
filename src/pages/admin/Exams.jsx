import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Table, Badge, Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const CLASS_OPTIONS = ['V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const AdminExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    class: '',
    section: 'A',
    subject: '',
    examName: '',
    examDate: '',
    academicYear: new Date().getFullYear().toString()
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/exams');
      setExams(response.data.data || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async (className, section) => {
    try {
      const response = await api.get('/admin/subjects', {
        params: { class: className, section }
      });
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setSubjects([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'class' || name === 'section') {
      const newClass = name === 'class' ? value : formData.class;
      const newSection = name === 'section' ? value : formData.section;
      if (newClass) {
        fetchSubjects(newClass, newSection);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingExam) {
        await api.put(`/admin/exams/${editingExam._id}`, {
          examName: formData.examName,
          examDate: formData.examDate,
          subject: formData.subject
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
      subject: '',
      examName: '',
      examDate: '',
      academicYear: new Date().getFullYear().toString()
    });
    setSubjects([]);
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
      subject: exam.subjects?.[0]?.name || '',
      examName: exam.examName,
      examDate: exam.examDate ? exam.examDate.split('T')[0] : '',
      academicYear: exam.academicYear
    });
    fetchSubjects(exam.class, exam.section);
    setShowModal(true);
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
                      <th>Subjects & Dates</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          No exams found
                        </td>
                      </tr>
                    ) : (
                      exams.map((exam, index) => {
                        const allPublished = (exam.subjects || []).length > 0 &&
                          exam.subjects.every(s => s.published);
                        const anyPublished = (exam.subjects || []).some(s => s.published);

                        return (
                          <tr key={exam._id}>
                            <td>{index + 1}</td>
                            <td>{exam.class}-{exam.section}</td>
                            <td>{exam.examName}</td>
                            <td>
                              {(exam.subjects || []).length === 0 ? (
                                <Badge bg="secondary">No subjects</Badge>
                              ) : (
                                exam.subjects.map((sub, i) => (
                                  <Badge
                                    key={i}
                                    bg={sub.published ? 'success' : 'warning'}
                                    className="me-1"
                                  >
                                    {sub.name} {sub.examDate ? `(${moment(sub.examDate).format('DD MMM')})` : ''}
                                  </Badge>
                                ))
                              )}
                            </td>
                            <td>
                              <Badge bg={allPublished ? 'success' : anyPublished ? 'info' : 'warning'}>
                                {allPublished ? 'Published' : anyPublished ? 'Partial' : 'Draft'}
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
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(exam._id)}
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
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
            {editingExam ? 'Add Subject to Exam' : 'Create New Exam'}
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
                      {CLASS_OPTIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
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
                  {editingExam && (
                    <Form.Text className="text-muted">
                      Same exam name — subject will be added to existing exam.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={!formData.class}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((s) => (
                      <option key={s._id} value={s.name}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </Form.Select>
                  {formData.class && subjects.length === 0 && (
                    <Form.Text className="text-danger">
                      No subjects found for this class & section. Please create subjects first.
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Exam Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="examDate"
                    value={formData.examDate}
                    onChange={handleChange}
                    required
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
              {submitting ? 'Saving...' : (editingExam ? 'Add Subject' : 'Create Exam')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminExams;