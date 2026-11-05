import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Form,
  Modal
} from 'react-bootstrap';
import {
  FaBullhorn,
  FaEye,
  FaSearch,
  FaCalendarAlt,
  FaUserTie,
  FaPaperclip
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const TeacherNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/teacher/notices');

      const data =
        response.data?.data?.notices ||
        response.data?.data ||
        response.data?.notices ||
        [];

      setNotices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setError(
        error.response?.data?.message ||
          'Failed to load notices'
      );
    } finally {
      setLoading(false);
    }
  };

  const openNotice = (notice) => {
    setSelectedNotice(notice);
    setShowModal(true);
  };

  const filteredNotices = notices.filter((notice) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      notice.title?.toLowerCase().includes(q) ||
      notice.content?.toLowerCase().includes(q) ||
      notice.message?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading notices...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="mb-1">
                <FaBullhorn className="me-2 text-primary" />
                Notices
              </h2>
              <p className="text-muted mb-0">
                Announcements and updates from administration
              </p>
            </div>
          </div>

          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Form.Group>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Search notices by title or content..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button variant="outline-primary" disabled>
                    <FaSearch />
                  </Button>
                </div>
              </Form.Group>
            </Card.Body>
          </Card>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {filteredNotices.length === 0 ? (
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <FaBullhorn size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No notices found</h5>
                <p className="text-muted mb-0">
                  {search
                    ? 'Try a different search term'
                    : 'No notices have been published yet'}
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table striped hover className="mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Published</th>
                        <th>By</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNotices.map((notice, index) => (
                        <tr key={notice._id || index}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="fw-bold">
                              {notice.title || 'Untitled'}
                            </div>
                            {notice.content && (
                              <small className="text-muted">
                                {notice.content.substring(0, 80)}
                                {notice.content.length > 80 ? '...' : ''}
                              </small>
                            )}
                          </td>
                          <td>
                            {notice.category ? (
                              <Badge bg="info">{notice.category}</Badge>
                            ) : (
                              <Badge bg="secondary">General</Badge>
                            )}
                          </td>
                          <td>
                            <small className="text-muted">
                              <FaCalendarAlt className="me-1" />
                              {notice.createdAt
                                ? moment(notice.createdAt).format('DD MMM YYYY')
                                : 'N/A'}
                            </small>
                          </td>
                          <td>
                            <small className="text-muted">
                              <FaUserTie className="me-1" />
                              {notice.createdBy?.name ||
                                notice.author?.name ||
                                'Admin'}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => openNotice(notice)}
                              >
                                <FaEye />
                              </Button>
                              {(notice.attachment ||
                                notice.attachments?.length > 0) && (
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  title="Has attachment"
                                  disabled
                                >
                                  <FaPaperclip />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaBullhorn className="me-2" />
            {selectedNotice?.title || 'Notice'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNotice && (
            <>
              <div className="mb-3 d-flex gap-2 flex-wrap">
                {selectedNotice.category && (
                  <Badge bg="info">{selectedNotice.category}</Badge>
                )}
                <Badge bg="secondary">
                  <FaCalendarAlt className="me-1" />
                  {selectedNotice.createdAt
                    ? moment(selectedNotice.createdAt).format(
                        'DD MMM YYYY, hh:mm A'
                      )
                    : 'N/A'}
                </Badge>
                <Badge bg="primary">
                  <FaUserTie className="me-1" />
                  {selectedNotice.createdBy?.name ||
                    selectedNotice.author?.name ||
                    'Admin'}
                </Badge>
              </div>

              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6
                }}
              >
                {selectedNotice.content ||
                  selectedNotice.message ||
                  'No content'}
              </div>

              {(selectedNotice.attachment ||
                selectedNotice.attachments?.length > 0) && (
                <Alert variant="info" className="mt-3 mb-0">
                  <FaPaperclip className="me-2" />
                  This notice has attachments. Contact administration to
                  access them.
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TeacherNotices;