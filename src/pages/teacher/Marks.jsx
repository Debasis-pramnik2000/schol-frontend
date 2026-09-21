import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Form, Button, Spinner, Badge 
} from 'react-bootstrap';
import { FaPlus, FaSave } from 'react-icons/fa';
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

  useEffect(() => {
    fetchClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/teacher/classes');
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
      const response = await api.get(`/api/teacher/classes/${classId}/students`);
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
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    if (classId) {
      fetchStudents(classId);
    } else {
      setStudents([]);
      setMarksData([]);
    }
  };

  const handleMarksChange = (studentIndex, subjectIndex, value) => {
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

        return api.post('/api/teacher/marks', {
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
            <Card className="shadow-sm">
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
                                  max={sub.totalMarks}
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
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherMarks;