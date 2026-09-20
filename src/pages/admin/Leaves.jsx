import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Badge, Form, Modal } from 'react-bootstrap';
import { FaCheck, FaTimes, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    role: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLeaves(); // ✅ Fixed: Changed from fetchLeases to fetchLeaves
  }, [filters]);

  // ✅ Renamed function from fetchLeases to fetchLeaves
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.role) params.append('role', filters.role);
      if (filters.month) params.append('month', filters.month);
      if (filters.year) params.append('year', filters.year);

      const response = await axios.get(`/api/leave/all?${params}`);
      setLeaves(response.data.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setError('Failed to load leaves');
      toast.error('Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedLeave) return;

    setSubmitting(true);
    try {
      await axios.put(`/api/leave/${selectedLeave._id}`, { 
        status, 
        remarks: remarks || 'No remarks'
      });
      toast.success(`Leave ${status.toLowerCase()} successfully!`);
      setShowModal(false);
      setRemarks('');
      fetchLeaves();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update leave');
    } finally {
      setSubmitting(false);
    }
  };

  const openActionModal = (leave) => {
    setSelectedLeave(leave);
    setRemarks('');
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Pending': 'warning',
      'Approved': 'success',
      'Rejected': 'danger',
      'Cancelled': 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getRoleBadge = (role) => {
    const variants = {
      'student': 'primary',
      'teacher': 'success',
      'admin': 'danger'
    };
    return <Badge bg={variants[role] || 'secondary'}>{role}</Badge>;
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
          <h2 className="mb-4">Leave Management</h2>

          {/* Filters */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <option value="">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      value={filters.role}
                      onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                    >
                      <option value="">All Roles</option>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Month</Form.Label>
                    <Form.Select
                      value={filters.month}
                      onChange={(e) => setFilters({ ...filters, month: parseInt(e.target.value) })}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                        <option key={m} value={m}>
                          {moment().month(m - 1).format('MMMM')}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Year</Form.Label>
                    <Form.Select
                      value={filters.year}
                      onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button variant="primary" onClick={fetchLeaves} className="w-100">
                    <FaFilter className="me-1" /> Apply
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Leave List */}
          <Card className="shadow-sm">
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              
              {leaves.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Applicant</th>
                        <th>Role</th>
                        <th>Type</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Days</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaves.map((leave, index) => (
                        <tr key={leave._id}>
                          <td>{index + 1}</td>
                          <td>{leave.user?.name || 'Unknown'}</td>
                          <td>{getRoleBadge(leave.role)}</td>
                          <td>{leave.leaveType}</td>
                          <td>{moment(leave.fromDate).format('DD MMM')}</td>
                          <td>{moment(leave.toDate).format('DD MMM')}</td>
                          <td>{leave.totalDays}</td>
                          <td>{getStatusBadge(leave.status)}</td>
                          <td>
                            {leave.status === 'Pending' && (
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="outline-success" 
                                  size="sm"
                                  onClick={() => openActionModal(leave)}
                                >
                                  <FaCheck /> Approve
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => openActionModal(leave)}
                                >
                                  <FaTimes /> Reject
                                </Button>
                              </div>
                            )}
                            {leave.status !== 'Pending' && (
                              <Badge bg="secondary">Processed</Badge>
                            )}
                          </td>
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

      {/* Action Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Process Leave Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Applicant:</strong> {selectedLeave?.user?.name}
          </p>
          <p>
            <strong>Leave Type:</strong> {selectedLeave?.leaveType}
          </p>
          <p>
            <strong>From:</strong> {moment(selectedLeave?.fromDate).format('DD MMM YYYY')}
          </p>
          <p>
            <strong>To:</strong> {moment(selectedLeave?.toDate).format('DD MMM YYYY')}
          </p>
          <p>
            <strong>Total Days:</strong> {selectedLeave?.totalDays}
          </p>
          <p>
            <strong>Reason:</strong> {selectedLeave?.reason}
          </p>

          <Form.Group className="mb-3">
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks (optional)"
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button 
              variant="success" 
              onClick={() => handleStatusUpdate('Approved')}
              disabled={submitting}
            >
              <FaCheck className="me-1" /> Approve
            </Button>
            <Button 
              variant="danger" 
              onClick={() => handleStatusUpdate('Rejected')}
              disabled={submitting}
            >
              <FaTimes className="me-1" /> Reject
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminLeaves;