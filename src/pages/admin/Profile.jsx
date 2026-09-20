import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Image, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import ProfilePhotoUpload from '../../components/common/ProfilePhotoUpload';
import { FaUser, FaEnvelope, FaPhone, FaUserCog } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminProfile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
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
      await axios.put('/api/admin/profile', formData);
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
    // Update user context
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
          <h2 className="mb-4">Admin Profile</h2>

          {success && (
            <Alert variant="success" className="mb-4">
              {success}
            </Alert>
          )}

          {/* ✅ Profile Photo Upload */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="fw-bold">
              <FaUserCog className="me-2" />
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

          {/* Profile Info Card */}
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
                  <Badge bg="danger" className="mt-2">
                    Administrator
                  </Badge>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Edit Profile Form */}
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

export default AdminProfile;