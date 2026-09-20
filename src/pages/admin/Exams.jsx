import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert,Table,Badge,Modal } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

const AdminExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    student: '',
    class: '',
    section: 'A',
    examName: '',
    examDate: '',
    subjects: [
      { name: '', marksObtained: '', totalMarks: 100, grade: '', remarks: '' }
    ],
    academicYear: new Date().getFullYear().toString()
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExams();
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/exams');
      setExams(response.data.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setError('Failed to load exams');
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

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/admin/classes');
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

  const handleSubjectChange = (index, field, value) => {
    const subjects = [...formData.subjects];
    subjects[index][field] = value;
    setFormData({ ...formData, subjects });
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [
        ...formData.subjects,
        { name: '', marksObtained: '', totalMarks: 100, grade: '', remarks: '' }
      ]
    });
  };

  const removeSubject = (index) => {
    if (formData.subjects.length > 1) {
      const subjects = formData.subjects.filter((_, i) => i !== index);
      setFormData({ ...formData, subjects });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingExam) {
        await axios.put(`/api/admin/exams/${editingExam._id}`, formData);
        toast.success('Exam updated successfully');
      } else {
        await axios.post('/api/admin/exams', formData);
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
      await axios.put(`/api/admin/exams/${id}/publish`);
      toast.success('Result published successfully');
      fetchExams();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to publish result');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await axios.delete(`/api/admin/exams/${id}`);
        toast.success('Exam deleted successfully');
        fetchExams();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete exam');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      student: '',
      class: '',
      section: 'A',
      examName: '',
      examDate: '',
      subjects: [
        { name: '', marksObtained: '', totalMarks: 100, grade: '', remarks: '' }
      ],
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
      student: exam.student?._id || exam.student || '',
      class: exam.class,
      section: exam.section,
      examName: exam.examName,
      examDate: exam.examDate ? exam.examDate.split('T')[0] : '',
      subjects: exam.subjects.map(s => ({
        name: s.name,
        marksObtained: s.marksObtained,
        totalMarks: s.totalMarks,
        grade: s.grade || '',
        remarks: s.remarks || ''
      })),
      academicYear: exam.academicYear
    });
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
                      <th>Student</th>
                      <th>Class</th>
                      <th>Exam Name</th>
                      <th>Date</th>
                      <th>Subjects</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((exam, index) => (
                      <tr key={exam._id}>
                        <td>{index + 1}</td>
                        <td>{exam.student?.rollNumber || 'N/A'}</td>
                        <td>{exam.class}-{exam.section}</td>
                        <td>{exam.examName}</td>
                        <td>{moment(exam.examDate).format('DD MMM YYYY')}</td>
                        <td>
                          <Badge bg="info">{exam.subjects?.length || 0} Subjects</Badge>
                        </td>
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
                              disabled={exam.published}
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingExam ? 'Edit Exam' : 'Create New Exam'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Student *</Form.Label>
                  <Form.Select
                    name="student"
                    value={formData.student}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.user?.name} ({student.rollNumber})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
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
              <Col md={4}>
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

            <h6 className="mt-3">Subjects</h6>
            <div className="table-responsive">
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Subject Name</th>
                    <th>Marks Obtained</th>
                    <th>Total Marks</th>
                    <th>Grade</th>
                    <th>Remarks</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.subjects.map((subject, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="Subject Name"
                          value={subject.name}
                          onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          placeholder="Marks"
                          value={subject.marksObtained}
                          onChange={(e) => handleSubjectChange(index, 'marksObtained', e.target.value)}
                          min="0"
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          placeholder="Total"
                          value={subject.totalMarks}
                          onChange={(e) => handleSubjectChange(index, 'totalMarks', e.target.value)}
                          min="1"
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="Grade"
                          value={subject.grade}
                          onChange={(e) => handleSubjectChange(index, 'grade', e.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="Remarks"
                          value={subject.remarks}
                          onChange={(e) => handleSubjectChange(index, 'remarks', e.target.value)}
                        />
                      </td>
                      <td className="text-center">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeSubject(index)}
                          disabled={formData.subjects.length === 1}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <Button variant="outline-primary" size="sm" onClick={addSubject}>
              <FaPlus className="me-1" /> Add Subject
            </Button>
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