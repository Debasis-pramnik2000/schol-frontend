import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Table, Form, Button, Spinner, Badge, Modal, Alert
} from 'react-bootstrap';
import { FaPlus, FaSave, FaEdit, FaCheck } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const TeacherMarks = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState(new Date().toISOString().split('T')[0]);
  const [marksData, setMarksData] = useState([]);

  const [results, setResults] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [editMarks, setEditMarks] = useState([]);
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/teacher/classes');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (classId) => {
    try {
      setLoading(true);
      const response = await api.get(`/teacher/classes/${classId}/students`);
      const classInfo = response.data.data.class;
      const studentsList = response.data.data.students;

      setClassData(classInfo);
      setStudents(studentsList);

      const initialMarks = studentsList.map(student => ({
        studentId: student._id,
        rollNumber: student.rollNumber,
        studentName: student.user?.name,
        subjects: classInfo.subjects?.map(sub => ({
          name: sub.name || sub.subject?.name,
          marksObtained: '',
          totalMarks: 100
        })) || []
      }));
      setMarksData(initialMarks);

      fetchResults(classInfo.className, classInfo.section);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (className, section) => {
    try {
      const response = await api.get('/teacher/results', {
        params: { class: className, section }
      });
      setResults(response.data.data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const canEdit = (result) => {
    if (!result.published) return true;
    if (!result.editDeadline) return false;
    return new Date() <= new Date(result.editDeadline);
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    if (classId) {
      fetchStudents(classId);
    } else {
      setStudents([]);
      setMarksData([]);
      setResults([]);
    }
  };

  const handleMarksChange = (studentIndex, subjectIndex, value) => {
    const num = Number(value);
    if (value !== '' && (num < 0 || num > 100)) {
      toast.warning('Marks must be between 0 and 100');
      return;
    }
    const updated = [...marksData];
    updated[studentIndex].subjects[subjectIndex].marksObtained = value;
    setMarksData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!examName) {
      toast.warning('Please enter exam name');
      return;
    }

    setSubmitting(true);

    try {
      const promises = marksData.map(student => {
        const subjects = student.subjects.map(sub => ({
          name: sub.name,
          marksObtained: parseInt(sub.marksObtained) || 0,
          totalMarks: sub.totalMarks,
          grade: calculateGrade(parseInt(sub.marksObtained) || 0, sub.totalMarks)
        }));

        return api.post('/teacher/marks', {
          studentId: student.studentId,
          class: classData.className,
          section: classData.section,
          examName: examName,
          examDate: examDate,
          subjects: subjects,
          academicYear: classData.academicYear
        });
      });

      await Promise.all(promises);
      toast.success('Marks entered successfully!');

      setExamName('');
      fetchStudents(selectedClass);
    } catch (error) {
      console.error('Error entering marks:', error);
      toast.error(error.response?.data?.message || 'Failed to enter marks');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (result) => {
    setEditingResult(result);
    setEditMarks(
      (result.subjects || []).map(s => ({
        name: s.name,
        marksObtained: s.marksObtained,
        totalMarks: s.totalMarks
      }))
    );
    setShowEditModal(true);
  };

  const handleEditMarkChange = (index, value) => {
    const num = Number(value);
    if (value !== '' && (num < 0 || num > 100)) {
      toast.warning('Marks must be between 0 and 100');
      return;
    }
    const updated = [...editMarks];
    updated[index].marksObtained = value;
    setEditMarks(updated);
  };

  const handleEditSubmit = async () => {
    setEditSubmitting(true);
    try {
      const subjects = editMarks.map(s => ({
        name: s.name,
        marksObtained: parseInt(s.marksObtained) || 0,
        totalMarks: s.totalMarks,
        grade: calculateGrade(parseInt(s.marksObtained) || 0, s.totalMarks)
      }));

      await api.put(`/teacher/results/${editingResult._id}`, { subjects });
      toast.success('Marks updated successfully!');
      setShowEditModal(false);
      fetchResults(classData.className, classData.section);
    } catch (error) {
      console.error('Error updating marks:', error);
      toast.error(error.response?.data?.message || 'Failed to update marks');
    } finally {
      setEditSubmitting(false);
    }
  };

  const calculateGrade = (marks, total) => {
    const percentage = (marks / total) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 33) return 'D';
    return 'F';
  };

  if (loading && classes.length === 0) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">Enter Marks</h2>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Select Class</Form.Label>
                    <Form.Select
                      value={selectedClass}
                      onChange={handleClassChange}
                    >
                      <option value="">Select a class...</option>
                      {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>
                          {cls.className} - Section {cls.section}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Exam Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Mid Term Exam"
                      value={examName}
                      onChange={(e) => setExamName(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Exam Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {selectedClass && marksData.length > 0 && (
            <Card className="shadow-sm mb-4">
              <Card.Header className="fw-bold">
                <FaPlus className="me-2" />
                Enter Marks for {classData?.className} - Section {classData?.section}
                <Badge bg="info" className="ms-2">
                  {students.length} Students
                </Badge>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Roll No</th>
                          <th>Student Name</th>
                          {classData?.subjects?.map((sub, idx) => (
                            <th key={idx}>
                              {sub.name || sub.subject?.name}
                              <br />
                              <small className="text-muted">(Total: 100)</small>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {marksData.map((student, sIndex) => (
                          <tr key={student.studentId}>
                            <td>{sIndex + 1}</td>
                            <td>{student.rollNumber}</td>
                            <td>{student.studentName}</td>
                            {student.subjects.map((sub, subIndex) => (
                              <td key={subIndex}>
                                <Form.Control
                                  type="number"
                                  size="sm"
                                  min="0"
                                  max="100"
                                  value={sub.marksObtained}
                                  onChange={(e) => handleMarksChange(sIndex, subIndex, e.target.value)}
                                  placeholder="Marks"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  <div className="text-end mt-3">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submitting || marksData.length === 0}
                    >
                      <FaSave className="me-1" />
                      {submitting ? 'Saving...' : 'Save Marks'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}

          {selectedClass && results.length > 0 && (
            <Card className="shadow-sm">
              <Card.Header className="fw-bold">
                <FaEdit className="me-2" /> Marks Given (Edit within 30 days)
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Student</th>
                        <th>Exam</th>
                        <th>Marks</th>
                        <th>Status</th>
                        <th>Deadline</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => {
                        const editable = canEdit(result);
                        const marksText = (result.subjects || [])
                          .map(s => `${s.name}: ${s.marksObtained}/${s.totalMarks}`)
                          .join(', ');
                        return (
                          <tr key={result._id}>
                            <td>{index + 1}</td>
                            <td>{result.student?.rollNumber || 'N/A'}</td>
                            <td>{result.examName}</td>
                            <td>
                              <small>{marksText || '-'}</small>
                              <div>
                                <Badge bg="secondary" className="mt-1">
                                  Total: {result.totalMarks ?? '-'} | Grade: {result.grade || '-'}
                                </Badge>
                              </div>
                            </td>
                            <td>
                              <Badge bg={result.published ? 'success' : 'warning'}>
                                {result.published ? 'Published' : 'Draft'}
                              </Badge>
                            </td>
                            <td>
                              {result.editDeadline
                                ? new Date(result.editDeadline).toLocaleDateString()
                                : '-'}
                            </td>
                            <td>
                              <Button
                                variant={editable ? 'outline-primary' : 'outline-secondary'}
                                size="sm"
                                onClick={() => openEditModal(result)}
                                disabled={!editable}
                              >
                                <FaEdit />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Marks — {editingResult?.examName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingResult?.editDeadline && (
            <Alert variant="info" className="py-2">
              Edit Deadline: {new Date(editingResult.editDeadline).toLocaleDateString()}
            </Alert>
          )}
          {editMarks.map((sub, index) => (
            <Form.Group key={index} className="mb-3">
              <Form.Label>{sub.name} (Total: {sub.totalMarks})</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={sub.marksObtained}
                onChange={(e) => handleEditMarkChange(index, e.target.value)}
              />
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit} disabled={editSubmitting}>
            <FaCheck className="me-1" />
            {editSubmitting ? 'Updating...' : 'Update Marks'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TeacherMarks;