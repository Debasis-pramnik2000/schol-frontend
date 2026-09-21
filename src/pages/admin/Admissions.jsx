import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Button, Form, 
  Badge, Spinner, Alert, Pagination, Modal, InputGroup
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaSearch, FaFilter, FaEye, FaCheck, FaTimes, 
  FaDownload, FaSync, FaUserPlus, FaClock, 
  FaCheckCircle, FaTimesCircle, FaBan, FaFileAlt,
  FaUsers, FaTrash, FaPhone
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const AdminAdmissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  
  const [filters, setFilters] = useState({
    status: '',
    class: '',
    search: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchAdmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.class) params.append('class', filters.class);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page);
      params.append('limit', filters.limit);
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/api/admin/admissions?${params}`);
      
      setAdmissions(response.data.data.admissions || []);
      setPagination(response.data.data.pagination || {});
    } catch (error) {
      console.error('Fetch admissions error:', error);
      setError('Failed to load admissions');
      toast.error('Failed to load admissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/admin/admissions/stats');
      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      class: '',
      search: '',
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const openApproveModal = (admission) => {
    setSelectedAdmission(admission);
    setRemarks('');
    setShowApproveModal(true);
  };

  const handleApprove = async () => {
    if (!selectedAdmission) return;

    setSubmitting(true);
    try {
      const response = await api.put(
        `/api/admin/admissions/${selectedAdmission._id}/approve`,
        { remarks: remarks || 'Approved by admin' }
      );

      if (response.data.success) {
        const creds = response.data.data.credentials;
        toast.success(
          <div>
            <strong>✅ Admission Approved!</strong>
            <div className="mt-2 small">
              <div>Username: <strong>{creds.username}</strong></div>
              <div>Password: <strong>{creds.password}</strong></div>
              <div>Roll No: <strong>{response.data.data.student.rollNumber}</strong></div>
            </div>
          </div>,
          { autoClose: 10000 }
        );
        
        setShowApproveModal(false);
        setSelectedAdmission(null);
        setRemarks('');
        fetchAdmissions();
        fetchStats();
      }
    } catch (error) {
      console.error('Approve error:', error);
      toast.error(error.response?.data?.message || 'Failed to approve admission');
    } finally {
      setSubmitting(false);
    }
  };

  const openRejectModal = (admission) => {
    setSelectedAdmission(admission);
    setRemarks('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!selectedAdmission) return;

    if (!remarks || remarks.trim() === '') {
      toast.warning('Please provide a reason for rejection');
      return;
    }

    setSubmitting(true);
    try {
      await api.put(
        `/api/admin/admissions/${selectedAdmission._id}/reject`,
        { remarks }
      );

      toast.success('Admission rejected successfully');
      setShowRejectModal(false);
      setSelectedAdmission(null);
      setRemarks('');
      fetchAdmissions();
      fetchStats();
    } catch (error) {
      console.error('Reject error:', error);
      toast.error(error.response?.data?.message || 'Failed to reject admission');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (admission) => {
    setSelectedAdmission(admission);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedAdmission) return;

    setSubmitting(true);
    try {
      await api.delete(`/api/admin/admissions/${selectedAdmission._id}`);
      toast.success('Admission deleted successfully');
      setShowDeleteModal(false);
      setSelectedAdmission(null);
      fetchAdmissions();
      fetchStats();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete admission');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) {
      toast.warning('Please select at least one admission');
      return;
    }

    if (!window.confirm(`Approve ${selectedIds.length} admission(s)?`)) return;

    try {
      const response = await api.post('/api/admin/admissions/bulk-approve', {
        admissionIds: selectedIds
      });

      toast.success(response.data.message);
      setSelectedIds([]);
      fetchAdmissions();
      fetchStats();
    } catch (error) {
      console.error('Bulk approve error:', error);
      toast.error(error.response?.data?.message || 'Failed to bulk approve');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pendingIds = admissions
        .filter(a => a.status === 'Pending')
        .map(a => a._id);
      setSelectedIds(pendingIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(
        `/api/admin/admissions/export?${params}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `admissions-${moment().format('YYYY-MM-DD')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export');
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'Pending': { bg: 'warning', icon: <FaClock className="me-1" /> },
      'Approved': { bg: 'success', icon: <FaCheckCircle className="me-1" /> },
      'Rejected': { bg: 'danger', icon: <FaTimesCircle className="me-1" /> },
      'Cancelled': { bg: 'secondary', icon: <FaBan className="me-1" /> }
    };
    const c = config[status] || { bg: 'secondary', icon: null };
    return (
      <Badge bg={c.bg} className="px-3 py-2">
        {c.icon} {status}
      </Badge>
    );
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="mb-1">
                <FaUserPlus className="me-2 text-primary" />
                Online Admissions
              </h2>
              <p className="text-muted mb-0">
                Manage student admission applications
              </p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              {selectedIds.length > 0 && (
                <Button 
                  variant="success" 
                  onClick={handleBulkApprove}
                >
                  <FaCheck className="me-2" />
                  Approve Selected ({selectedIds.length})
                </Button>
              )}
              <Button variant="outline-success" onClick={handleExport}>
                <FaDownload className="me-2" /> Export CSV
              </Button>
              <Button 
                variant="outline-primary" 
                onClick={() => {
                  fetchAdmissions();
                  fetchStats();
                }}
                disabled={loading}
              >
                <FaSync className={loading ? 'spin' : ''} /> Refresh
              </Button>
            </div>
          </div>

          <Row className="mb-4">
            <Col lg={3} md={6} className="mb-3">
              <Card className="stat-card stat-total border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Total Applications</p>
                      <h3 className="mb-0">{stats?.total || 0}</h3>
                    </div>
                    <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                      <FaUsers />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="stat-card stat-pending border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Pending</p>
                      <h3 className="mb-0 text-warning">{stats?.pending || 0}</h3>
                    </div>
                    <div className="stat-icon bg-warning bg-opacity-10 text-warning">
                      <FaClock />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="stat-card stat-approved border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Approved</p>
                      <h3 className="mb-0 text-success">{stats?.approved || 0}</h3>
                    </div>
                    <div className="stat-icon bg-success bg-opacity-10 text-success">
                      <FaCheckCircle />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="stat-card stat-rejected border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-1 small">Rejected</p>
                      <h3 className="mb-0 text-danger">{stats?.rejected || 0}</h3>
                    </div>
                    <div className="stat-icon bg-danger bg-opacity-10 text-danger">
                      <FaTimesCircle />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="shadow-sm mb-4 border-0">
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text><FaSearch /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by name, mobile, app no..."
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Form.Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select
                    name="class"
                    value={filters.class}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Classes</option>
                    <option value="Class V">Class V</option>
                    <option value="Class VI">Class VI</option>
                    <option value="Class VII">Class VII</option>
                    <option value="Class VIII">Class VIII</option>
                    <option value="Class IX">Class IX</option>
                    <option value="Class X">Class X</option>
                    <option value="Class XI">Class XI</option>
                    <option value="Class XII">Class XII</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select
                    name="limit"
                    value={filters.limit}
                    onChange={handleFilterChange}
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="outline-secondary" 
                    onClick={clearFilters}
                    className="w-100"
                  >
                    <FaFilter className="me-1" /> Clear
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0">
            <Card.Body className="p-0">
              {error && (
                <Alert variant="danger" className="m-3">
                  {error}
                </Alert>
              )}

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3 text-muted">Loading admissions...</p>
                </div>
              ) : (admissions || []).length > 0 ? (
                <>
                  <div className="table-responsive">
                    <Table striped hover className="mb-0 admissions-table">
                      <thead className="table-light">
                        <tr>
                          <th width="40">
                            <Form.Check
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={
                                admissions.filter(a => a.status === 'Pending').length > 0 &&
                                selectedIds.length === admissions.filter(a => a.status === 'Pending').length
                              }
                            />
                          </th>
                          <th>App No</th>
                          <th>Student</th>
                          <th>Class</th>
                          <th>Contact</th>
                          <th>Applied</th>
                          <th>Status</th>
                          <th width="180">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {admissions.map((admission) => (
                          <tr key={admission._id}>
                            <td>
                              {admission.status === 'Pending' && (
                                <Form.Check
                                  type="checkbox"
                                  checked={selectedIds.includes(admission._id)}
                                  onChange={() => handleSelectOne(admission._id)}
                                />
                              )}
                            </td>
                            <td>
                              <strong className="text-primary">
                                {admission.applicationNumber}
                              </strong>
                            </td>
                            <td>
                              <div>
                                <strong>{admission.studentName}</strong>
                                <div className="small text-muted">
                                  Father: {admission.fatherName}
                                </div>
                              </div>
                            </td>
                            <td>
                              <Badge bg="info">{admission.applyingForClass}</Badge>
                            </td>
                            <td>
                              <div className="small">
                                <div><FaPhone className="me-1 text-muted" />{admission.mobile}</div>
                                <div className="text-muted">Aadhaar: ****{admission.aadhaarNumber?.slice(-4)}</div>
                              </div>
                            </td>
                            <td>
                              <small className="text-muted">
                                {moment(admission.createdAt).format('DD MMM YYYY')}
                              </small>
                            </td>
                            <td>{getStatusBadge(admission.status)}</td>
                            <td>
                              <div className="d-flex gap-1 flex-wrap">
                                <Link to={`/admin/admissions/${admission._id}`}>
                                  <Button variant="outline-info" size="sm" title="View Details">
                                    <FaEye />
                                  </Button>
                                </Link>

                                {admission.status === 'Pending' && (
                                  <>
                                    <Button 
                                      variant="outline-success" 
                                      size="sm"
                                      onClick={() => openApproveModal(admission)}
                                      title="Approve"
                                    >
                                      <FaCheck />
                                    </Button>
                                    <Button 
                                      variant="outline-danger" 
                                      size="sm"
                                      onClick={() => openRejectModal(admission)}
                                      title="Reject"
                                    >
                                      <FaTimes />
                                    </Button>
                                  </>
                                )}

                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  onClick={() => openDeleteModal(admission)}
                                  title="Delete"
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                  {pagination.pages > 1 && (
                    <div className="d-flex justify-content-between align-items-center p-3 border-top">
                      <small className="text-muted">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} - {' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of {' '}
                        {pagination.total} applications
                      </small>
                      <Pagination className="mb-0">
                        <Pagination.Prev
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page === 1}
                        />
                        {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                          let pageNum = i + 1;
                          if (pagination.pages > 5 && pagination.page > 3) {
                            pageNum = pagination.page - 2 + i;
                          }
                          if (pageNum > pagination.pages) return null;
                          return (
                            <Pagination.Item
                              key={pageNum}
                              active={pageNum === pagination.page}
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </Pagination.Item>
                          );
                        })}
                        <Pagination.Next
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page === pagination.pages}
                        />
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5">
                  <FaFileAlt size={60} className="text-muted mb-3" />
                  <h5 className="text-muted">No Admissions Found</h5>
                  <p className="text-muted">
                    {filters.search || filters.status || filters.class
                      ? 'Try adjusting your filters'
                      : 'No admission applications yet'}
                  </p>
                  {(filters.search || filters.status || filters.class) && (
                    <Button variant="outline-primary" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            <FaCheckCircle className="me-2" />
            Approve Admission
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAdmission && (
            <>
              <Alert variant="info">
                <strong>Application:</strong> {selectedAdmission.applicationNumber}
                <br />
                <strong>Student:</strong> {selectedAdmission.studentName}
                <br />
                <strong>Class:</strong> {selectedAdmission.applyingForClass}
              </Alert>

              <Alert variant="warning">
                <strong>⚠️ Note:</strong> Approving will auto-create:
                <ul className="mb-0 mt-2">
                  <li>User Account</li>
                  <li>Student Profile</li>
                  <li>Username & Password</li>
                  <li>Roll Number</li>
                </ul>
              </Alert>

              <Form.Group>
                <Form.Label>Remarks (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add remarks..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handleApprove}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Approving...
              </>
            ) : (
              <>
                <FaCheck className="me-2" /> Approve & Create Student
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <FaTimesCircle className="me-2" />
            Reject Admission
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAdmission && (
            <>
              <Alert variant="info">
                <strong>Application:</strong> {selectedAdmission.applicationNumber}
                <br />
                <strong>Student:</strong> {selectedAdmission.studentName}
              </Alert>

              <Form.Group>
                <Form.Label>
                  Reason for Rejection <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g., Documents incomplete, Age criteria not met, etc."
                  required
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleReject}
            disabled={submitting || !remarks.trim()}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Rejecting...
              </>
            ) : (
              <>
                <FaTimes className="me-2" /> Reject Admission
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-secondary text-white">
          <Modal.Title>
            <FaTrash className="me-2" />
            Delete Admission
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAdmission && (
            <Alert variant="warning">
              <strong>⚠️ Warning!</strong> This action cannot be undone.
              <br />
              <br />
              <strong>Application:</strong> {selectedAdmission.applicationNumber}
              <br />
              <strong>Student:</strong> {selectedAdmission.studentName}
              <br />
              <br />
              All uploaded documents will also be deleted.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminAdmissions;