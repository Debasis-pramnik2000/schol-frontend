import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Image, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import ProfilePhotoUpload from '../../components/common/ProfilePhotoUpload';
import { FaUser, FaEnvelope, FaPhone, FaChalkboardTeacher } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const TeacherProfile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    qualification: user?.qualification || '',
    specialization: user?.specialization || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePicture || null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      await api.put('/api/teacher/profile', formData);
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpdate = (newPhoto) => {
    setProfilePhoto(newPhoto);
    if (newPhoto) {
      updateProfile({ ...formData, profilePicture: newPhoto });
    } else {
      updateProfile({ ...formData, profilePicture: '' });
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <h2 className="mb-4">Teacher Profile</h2>

          {success && (
            <Alert variant="success" className="mb-4">
              {success}
            </Alert>
          )}

          <Card className="shadow-sm mb-4">
            <Card.Header className="fw-bold">
              <FaChalkboardTeacher className="me-2" />
              Profile Photo
            </Card.Header>
            <Card.Body>
              <ProfilePhotoUpload
                currentPhoto={profilePhoto}
                onPhotoUpdate={handlePhotoUpdate}
                userId={user?.id}
              />
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={3} className="text-center">
                  <Image
                    src={profilePhoto || 'https://via.placeholder.com/150'}
                    roundedCircle
                    width={150}
                    height={150}
                    className="mb-3"
                    style={{ objectFit: 'cover' }}
                  />
                </Col>
                <Col md={9}>
                  <h4>{user?.name}</h4>
                  <p className="text-muted">
                    <FaChalkboardTeacher className="me-2" />
                    {user?.qualification || 'No qualification'} | {user?.specialization || 'No specialization'}
                  </p>
                  <p className="text-muted">
                    <FaUser className="me-2" />
                    Username: {user?.username}
                  </p>
                  <p className="text-muted">
                    <FaEnvelope className="me-2" />
                    {user?.email}
                  </p>
                  <p className="text-muted">
                    <FaPhone className="me-2" />
                    {user?.phone || 'No phone number added'}
                  </p>
                  <Badge bg="success" className="mt-2">
                    Teacher
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header className="fw-bold">Edit Profile</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaUser className="me-2" />
                    Full Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaEnvelope className="me-2" />
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

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

                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaChalkboardTeacher className="me-2" />
                    Qualification
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="e.g., M.Sc. in Mathematics"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Specialization</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    placeholder="e.g., Algebra, Calculus"
                  />
                </Form.Group>

                <div className="text-end">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>

                <hr className="my-4" />
                <div className="text-muted small">
                  <p className="mb-1">⚠️ Note: Username cannot be changed</p>
                  <p className="mb-0">Username: <strong>{user?.username}</strong></p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TeacherProfile;