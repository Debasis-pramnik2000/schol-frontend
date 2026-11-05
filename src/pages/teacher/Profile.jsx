import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Image, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import ProfilePhotoUpload from '../../components/common/ProfilePhotoUpload';
import { FaUser, FaEnvelope, FaPhone, FaChalkboardTeacher } from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const TeacherProfile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    specialization: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/teacher/profile');
        const d = res.data.data;
        setFormData({
          name: d.name || '',
          email: d.email || '',
          phone: d.phone || '',
          qualification: d.qualification || '',
          specialization: d.specialization || ''
        });
        setProfilePhoto(d.profilePicture || null);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');

    try {
      await api.put('/teacher/profile', formData);
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading profile...</p>
      </Container>
    );
  }

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
                  <h4>{formData.name || user?.name}</h4>
                  <p className="text-muted">
                    <FaChalkboardTeacher className="me-2" />
                    {formData.qualification || 'No qualification'} | {formData.specialization || 'No specialization'}
                  </p>
                  <p className="text-muted">
                    <FaUser className="me-2" />
                    Username: {user?.username}
                  </p>
                  <p className="text-muted">
                    <FaEnvelope className="me-2" />
                    {formData.email || user?.email}
                  </p>
                  <p className="text-muted">
                    <FaPhone className="me-2" />
                    {formData.phone || 'No phone number added'}
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
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
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