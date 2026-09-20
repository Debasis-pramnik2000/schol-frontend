import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { FaLock, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePassword = () => {
  const { changePassword } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);
    const result = await changePassword(formData.currentPassword, formData.newPassword);
    
    if (result.success) {
      setSuccess('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      setError(result.message || 'Failed to change password');
    }
    setLoading(false);
  };

  return (
    <Container className="py-4">
      <Row>
        <Col lg={6} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Header className="fw-bold bg-primary text-white">
              <FaLock className="me-2" />
              Change Password
            </Card.Header>
            <Card.Body className="p-4">
              <p className="text-muted mb-4">
                Please enter your current password and choose a new secure password.
              </p>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mb-4">
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showCurrent ? 'text' : 'password'}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                      required
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-0 text-secondary"
                      onClick={() => setShowCurrent(!showCurrent)}
                      style={{ padding: '0.375rem 0.75rem' }}
                    >
                      {showCurrent ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showNew ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password (min 6 characters)"
                      required
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-0 text-secondary"
                      onClick={() => setShowNew(!showNew)}
                      style={{ padding: '0.375rem 0.75rem' }}
                    >
                      {showNew ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters long
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm New Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter new password"
                      required
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-0 text-secondary"
                      onClick={() => setShowConfirm(!showConfirm)}
                      style={{ padding: '0.375rem 0.75rem' }}
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </Form.Group>

                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    <FaKey className="me-1" />
                    Remember to keep your password secure
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;