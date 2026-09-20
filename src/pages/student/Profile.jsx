import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import ProfilePhotoUpload from '../../components/common/ProfilePhotoUpload';
import {FaCamera, FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaIdCard } from 'react-icons/fa';

const StudentProfile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    parentName: user?.parentName || '',
    parentPhone: user?.parentPhone || '',
    address: user?.address || '',
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
    
    const result = await updateProfile(formData);
    
    if (result.success) {
      setSuccess('Profile updated successfully!');
    }
    setLoading(false);
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
          <h2 className="mb-4">My Profile</h2>
          
          {success && (
            <Alert variant="success" className="mb-4">
              {success}
            </Alert>
          )}

          {/* Profile Photo Upload */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="fw-bold">
              <FaCamera className="me-2" />
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

          {/* Student Info Card */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={3} className="text-center">
                  <img 
                    src={profilePhoto || 'https://via.placeholder.com/150'} 
                    alt={user?.name}
                    className="rounded-circle"
                    width={150}
                    height={150}
                    style={{ objectFit: 'cover' }}
                  />
                </Col>
                <Col md={9}>
                  <h4>{user?.name}</h4>
                  <p className="text-muted">
                    <FaIdCard className="me-2" />
                    Roll No: {user?.rollNumber}
                  </p>
                  <p className="text-muted">
                    <FaGraduationCap className="me-2" />
                    Class {user?.class}-{user?.section}
                  </p>
                  <p className="text-muted">
                    <FaEnvelope className="me-2" />
                    {user?.email}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Edit Profile Form */}
          <Card className="shadow-sm">
            <Card.Header className="fw-bold">Edit Profile</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
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
                  </Col>
                  <Col md={6}>
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
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
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
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Parent's Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Parent's Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={formData.address}
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

export default StudentProfile;