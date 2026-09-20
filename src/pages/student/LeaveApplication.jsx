import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Table, Badge, Modal } from 'react-bootstrap';
import { FaPlus, FaCheck, FaTimes, FaClock, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

const StudentLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statistics, setStatistics] = useState({});
  const [formData, setFormData] = useState({
    leaveType: 'Casual Leave',
    reason: '',
    fromDate: '',
    toDate: '',
    remarks: ''
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/leave/my-leaves');
      setLeaves(response.data.data.leaves);
      setStatistics(response.data.data.statistics);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error('Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post('/api/leave/apply', formData);
      toast.success('Leave application submitted successfully!');
      setShowModal(false);
      resetForm();
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply for leave');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      leaveType: 'Casual Leave',
      reason: '',
      fromDate: '',
      toDate: '',
      remarks: ''
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Pending': 'warning',
      'Approved': 'success',
      'Rejected': 'danger',
      'Cancelled': 'secondary'
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading leave applications...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <h2>Leave Management</h2>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <FaPlus className="me-2" /> Apply for Leave
            </Button>
          </div>

          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col md={3} sm={6}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-muted">Used Leaves</h6>
                  <h3 className="text-warning">{statistics.used || 0}</h3>
                  <small className="text-muted">This month</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-muted">Available Leaves</h6>
                  <h3 className="text-success">{statistics.available || 4}</h3>
                  <small className="text-muted">This month</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-muted">Pending</h6>
                  <h3 className="text-warning">{statistics.pending || 0}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <h6 className="text-muted">Approved</h6>
                  <h3 className="text-success">{statistics.approved || 0}</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Leave List */}
          <Card className="shadow-sm">
            <Card.Body>
              {leaves.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Days</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.map((leave, index) => (
                        <tr key={leave._id}>
                          <td>{index + 1}</td>
                          <td>{leave.leaveType}</td>
                          <td>{moment(leave.fromDate).format('DD MMM')}</td>
                          <td>{moment(leave.toDate).format('DD MMM')}</td>
                          <td>{leave.totalDays}</td>
                          <td>{leave.reason.substring(0, 30)}...</td>
                          <td>{getStatusBadge(leave.status)}</td>
                          <td>{leave.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-muted py-3">
                  No leave applications found
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Apply Leave Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Apply for Leave</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Leave Type</Form.Label>
              <Form.Select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                required
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Medical Leave">Medical Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
                <option value="Study Leave">Study Leave</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                placeholder="Please provide a detailed reason"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>To Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleChange}
                    required
                    min={formData.fromDate || new Date().toISOString().split('T')[0]}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Remarks (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Any additional information"
              />
            </Form.Group>

            <Alert variant="info">
              <small>
                <FaClock className="me-2" />
                You can apply for maximum <strong>4 leaves</strong> per month.
                <br />
                Currently used: <strong>{statistics.used || 0}</strong> leaves
              </small>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default StudentLeave;