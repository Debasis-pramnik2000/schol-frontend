import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, FaUserTie, FaGraduationCap, 
  FaBriefcase, FaSchool 
} from 'react-icons/fa';

const Teachers = () => {
  const teachers = [
{ 
    id: 1, 
    name: 'Sankhadip Mondal', 
    photo: '/images/teachers/teacher1.jpg', 
    qualification: 'M.A. English, B.Ed', 
    specialization: 'Head Teacher',        // ✅ Changed
    department: 'Administration',          // ✅ Changed
    experience: 12, 
    subjects: ['English', 'Head Teacher']  // ✅ Changed
  },    { id: 2, name: 'Biplab Bichar', photo: '/images/teachers/teacher2.jpg', qualification: 'M.Sc. B.Ed', specialization: 'Geography', department: 'Science', experience: 10, subjects: ['Geography'] },
    { id: 3, name: 'Susanta Maity', photo: '/images/teachers/teacher3.jpg', qualification: 'M.Sc. Mathematics', specialization: 'Mathematics', department: 'Science', experience: 8, subjects: ['Mathematics'] },
    { id: 4, name: 'Subir Kumar Das', photo: '/images/teachers/teacher4.jpg', qualification: 'M.Sc. Mathematics, B.Ed', specialization: 'Mathematics', department: 'Science', experience: 9, subjects: ['Mathematics'] },
    { id: 5, name: 'Anup Bag', photo: '/images/teachers/teacher5.jpg', qualification: 'M.A. Darshan, B.Ed', specialization: 'Philosophy', department: 'Arts', experience: 7, subjects: ['Darshan'] },
    { id: 6, name: 'Ashok Kumar Das', photo: '/images/teachers/teacher6.jpg', qualification: 'B.P.Ed', specialization: 'Physical Education', department: 'Arts', experience: 6, subjects: ['Physical Education'] },
    { id: 7, name: 'Amitav Biswas', photo: '/images/teachers/teacher7.jpg', qualification: 'M.A. History, B.Ed', specialization: 'History', department: 'Arts', experience: 8, subjects: ['History'] },
    { id: 8, name: 'Raju Doali', photo: '/images/teachers/teacher8.jpg', qualification: 'M.Sc. Physical Science, B.Ed', specialization: 'Physical Science', department: 'Science', experience: 7, subjects: ['Physical Science'] },
    { id: 9, name: 'Sourav Das', photo: '/images/teachers/teacher9.jpg', qualification: 'M.Sc. Life Science, B.Ed', specialization: 'Life Science', department: 'Science', experience: 6, subjects: ['Life Science'] }
  ];

  const getDepartmentColor = (dept) => {
    const colors = { 'Science': 'primary', 'Commerce': 'success', 'Arts': 'info' };
    return colors[dept] || 'secondary';
  };

  return (
    <div className="about-page">
      {/* Header */}
      <div className="about-header">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="mb-2">
                <FaUserTie className="me-3" />
                Our Faculty
              </h1>
              <p className="mb-0 text-white-50">
                <FaSchool className="me-2" />
                Meet our {teachers.length} experienced educators
              </p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Link to="/about" className="btn btn-outline-light">
                <FaArrowLeft className="me-2" /> Back to About
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Row>
          {teachers.map((teacher) => (
            <Col lg={3} md={4} sm={6} key={teacher.id} className="mb-4">
              <Card className="teacher-card shadow-sm border-0 h-100">
                <div className="teacher-photo-wrapper">
                  <Image 
                    src={teacher.photo}
                    alt={teacher.name}
                    className="teacher-photo"
                    onError={(e) => {
                      const initial = teacher.name.charAt(0).toUpperCase();
                      e.target.src = `https://via.placeholder.com/200x200/667eea/ffffff?text=${initial}`;
                    }}
                  />
                </div>
                <Card.Body className="text-center">
                  <h5 className="mb-2">{teacher.name}</h5>
                  <Badge bg="info" className="mb-2">
                    <FaGraduationCap className="me-1" />
                    {teacher.qualification}
                  </Badge>
                  <p className="small text-muted mb-2">
                    <strong>Specialization:</strong> {teacher.specialization}
                  </p>
                  <Badge bg={getDepartmentColor(teacher.department)} className="mb-2">
                    {teacher.department}
                  </Badge>
                  <p className="small text-muted mb-2">
                    <FaBriefcase className="me-1" />
                    {teacher.experience} Years Experience
                  </p>
                  {teacher.subjects && (
                    <div className="mt-2">
                      <small className="text-muted d-block mb-1">Teaches:</small>
                      <div className="d-flex flex-wrap gap-1 justify-content-center">
                        {teacher.subjects.map((subject, idx) => (
                          <Badge bg="secondary" key={idx} className="small">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-4">
          <Link to="/about">
            <Button variant="primary">
              <FaArrowLeft className="me-2" /> Back to About
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default Teachers;