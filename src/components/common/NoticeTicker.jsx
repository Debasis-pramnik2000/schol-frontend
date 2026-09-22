
import React, { useState, useEffect } from 'react';
import { Card, Badge, Spinner, Modal, Button } from 'react-bootstrap';
import {
  FaBell,
  FaDownload,
  FaFilePdf,
  FaEye,
  FaCalendarAlt,
  FaUser
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';

const NoticeTicker = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  // Automatically move notices upward one by one
  useEffect(() => {
    if (notices.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= notices.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [notices.length, isPaused]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/api/public/notices');

      setNotices(response.data.data || []);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching notices:', error);
      setError('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleNoticeClick = async (notice) => {
    // Stop automatic movement when user clicks a notice
    setIsPaused(true);

    try {
      const response = await api.get(`/api/public/notices/${notice._id}`);

      setSelectedNotice(response.data.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching notice:', error);
      toast.error('Failed to load notice');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsPaused(false);
  };

  const downloadPDF = async (noticeId) => {
    setDownloading(true);

    try {
      const response = await api.get(
        `/api/public/notices/${noticeId}/pdf`,
        {
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `notice-${noticeId}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success('Notice downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download notice');
    } finally {
      setDownloading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      Low: 'secondary',
      Medium: 'info',
      High: 'warning',
      Urgent: 'danger'
    };

    return colors[priority] || 'info';
  };

  const isNewNotice = (createdAt) => {
    const hoursDiff =
      (new Date() - new Date(createdAt)) /
      (1000 * 60 * 60);

    return hoursDiff < 24;
  };

  const getFileName = (att) => {
    if (typeof att === 'string') {
      return att.split('/').pop() || 'Attachment';
    }

    return att.fileName || 'Attachment';
  };

  const getFileUrl = (att) => {
    if (typeof att === 'string') {
      return att;
    }

    return att.fileUrl || '#';
  };

  if (loading) {
    return (
      <Card className="notice-ticker-card shadow-sm">
        <Card.Header className="bg-primary text-white">
          <FaBell className="me-2" />
          Notices
        </Card.Header>

        <Card.Body className="text-center py-4">
          <Spinner
            animation="border"
            size="sm"
            variant="primary"
          />

          <p className="mt-2 text-muted small mb-0">
            Loading notices...
          </p>
        </Card.Body>
      </Card>
    );
  }

  if (error || notices.length === 0) {
    return (
      <Card className="notice-ticker-card shadow-sm">
        <Card.Header className="bg-primary text-white">
          <FaBell className="me-2" />
          Notices
        </Card.Header>

        <Card.Body className="text-center py-4">
          <p className="text-muted small mb-0">
            No notices available
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <style>
        {`
          .notice-scroll-container {
            height: 170px;
            overflow: hidden;
            position: relative;
          }

          .notice-scroll-track {
            transition: transform 0.8s ease-in-out;
          }

          .notice-ticker-item {
            min-height: 170px;
            box-sizing: border-box;
            background: #fff;
          }

          .notice-ticker-item:hover {
            background: #f8f9fa;
          }

          .new-badge {
            display: inline-flex;
            align-items: center;
            background: #dc3545;
            color: white;
            padding: 2px 7px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
          }

          .blink {
            animation: noticeBlink 1s infinite;
          }

          @keyframes noticeBlink {
            0% {
              opacity: 1;
            }

            50% {
              opacity: 0.15;
            }

            100% {
              opacity: 1;
            }
          }

          .notice-title {
            font-weight: 600;
          }

          .notice-content {
            line-height: 1.5;
          }

          @media (max-width: 576px) {
            .notice-scroll-container {
              height: 180px;
            }

            .notice-ticker-item {
              min-height: 180px;
            }
          }
        `}
      </style>

      <Card className="notice-ticker-card shadow-sm">

        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <span>
            <FaBell className="me-2" />
            Notices
          </span>

          <Badge bg="light" text="dark">
            {notices.length}
          </Badge>
        </Card.Header>

        <Card.Body className="p-0">

          <div className="notice-scroll-container">

            <div
              className="notice-scroll-track"
              style={{
                transform: `translateY(-${currentIndex * 170}px)`
              }}
            >

              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className="notice-ticker-item p-3 border-bottom"
                  onClick={() => handleNoticeClick(notice)}
                  style={{ cursor: 'pointer' }}
                >

                  <div className="d-flex align-items-center gap-2 mb-2">

                    {isNewNotice(notice.createdAt) && (
                      <span className="new-badge">
                        <span className="blink">
                          NEW
                        </span>
                      </span>
                    )}

                    <Badge
                      bg={getPriorityColor(notice.priority)}
                      className="small"
                    >
                      {notice.priority}
                    </Badge>

                  </div>

                  <h6 className="mb-1 notice-title">
                    {notice.title}
                  </h6>

                  <p className="text-muted small mb-2 notice-content">
                    {notice.content?.substring(0, 100)}
                    {notice.content?.length > 100 ? '...' : ''}
                  </p>

                  <div className="d-flex justify-content-between align-items-center">

                    <small className="text-muted">
                      <FaCalendarAlt className="me-1" />

                      {moment(notice.createdAt).format(
                        'DD MMM YYYY'
                      )}
                    </small>

                    <small className="text-primary">
                      <FaFilePdf className="me-1" />
                      Click to view
                    </small>

                  </div>

                </div>
              ))}

            </div>

          </div>

        </Card.Body>
      </Card>

      <Modal
        show={showModal}
        onHide={handleModalClose}
        size="lg"
        centered
      >

        <Modal.Header
          closeButton
          className="bg-primary text-white"
        >
          <Modal.Title>
            <FaBell className="me-2" />
            Notice Details
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          {selectedNotice && (
            <div>

              <div className="d-flex justify-content-between align-items-start mb-3">

                <h4 className="mb-0">
                  {selectedNotice.title}
                </h4>

                <div className="d-flex gap-2">

                  {isNewNotice(selectedNotice.createdAt) && (
                    <span className="new-badge">
                      <span className="blink">
                        NEW
                      </span>
                    </span>
                  )}

                  <Badge
                    bg={getPriorityColor(
                      selectedNotice.priority
                    )}
                  >
                    {selectedNotice.priority}
                  </Badge>

                </div>

              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">

                <div className="text-muted small">
                  <FaUser className="me-1" />

                  Posted by:{' '}
                  <strong>
                    {selectedNotice.author?.name || 'Admin'}
                  </strong>
                </div>

                <div className="text-muted small">
                  <FaCalendarAlt className="me-1" />

                  {moment(selectedNotice.createdAt).format(
                    'DD MMM YYYY, hh:mm A'
                  )}
                </div>

                <div className="text-muted small">
                  <FaEye className="me-1" />

                  {selectedNotice.views || 0} views
                </div>

              </div>

              <hr />

              <div className="notice-full-content mb-3">

                <p
                  style={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.8',
                    marginBottom: 0
                  }}
                >
                  {selectedNotice.content}
                </p>

              </div>

              {selectedNotice.attachments &&
                selectedNotice.attachments.length > 0 && (
                  <div className="mb-3">

                    <h6>Attachments:</h6>

                    <ul className="list-unstyled">

                      {selectedNotice.attachments.map(
                        (att, idx) => (
                          <li
                            key={idx}
                            className="mb-1"
                          >

                            <a
                              href={getFileUrl(att)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              <FaFilePdf className="me-1 text-danger" />

                              {getFileName(att)}
                            </a>

                          </li>
                        )
                      )}

                    </ul>

                  </div>
                )}

            </div>
          )}

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={handleModalClose}
          >
            Close
          </Button>

          <Button
            variant="primary"
            onClick={() =>
              downloadPDF(selectedNotice?._id)
            }
            disabled={downloading}
          >
            <FaDownload className="me-2" />

            {downloading
              ? 'Downloading...'
              : 'Download PDF'}
          </Button>

        </Modal.Footer>

      </Modal>
    </>
  );
};

export default NoticeTicker;

