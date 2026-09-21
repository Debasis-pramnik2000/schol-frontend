import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Table,
  Badge
} from 'react-bootstrap';
import { FaMapMarkerAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import moment from 'moment';

const StudentAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    fetchAttendanceHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/student/attendance');
      setAttendanceHistory(response.data.data.records);
      setStatistics(response.data.data.statistics);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError('Failed to load attendance history');
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        toast.success('Location captured successfully!');
      },
      (error) => {
        let message = 'Failed to get location. ';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message += 'Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            message += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message += 'Location request timed out.';
            break;
          default:
            message += 'Unknown error occurred.';
        }

        setLocationError(message);
        toast.error(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const markAttendance = async () => {
    if (!location) {
      toast.warning('Please get your location first');
      return;
    }

    setMarking(true);

    try {
      await api.post('/api/student/attendance', {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy
      });

      toast.success('Attendance marked successfully!');
      setLocation(null);
      fetchAttendanceHistory();
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to mark attendance';
      toast.error(message);
    } finally {
      setMarking(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Present: 'success',
      Absent: 'danger',
      Late: 'warning',
      'Not Marked': 'secondary'
    };

    return (
      <Badge bg={variants[status] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading attendance...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <h2 className="mb-4">Smart Attendance System</h2>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Card className="shadow-sm mb-4">
            <Card.Header className="fw-bold bg-primary text-white">
              <FaMapMarkerAlt className="me-2" />
              Mark Today's Attendance
            </Card.Header>

            <Card.Body className="text-center py-4">
              <p className="text-muted mb-3">
                You need to be within 1km radius of the institute to mark
                attendance
              </p>

              {locationError && (
                <Alert variant="warning" className="text-start">
                  <FaTimesCircle className="me-2" />
                  {locationError}
                </Alert>
              )}

              {location && (
                <Alert variant="success" className="text-start">
                  <FaCheckCircle className="me-2" />
                  Location captured:{' '}
                  {Number(location.latitude || 0).toFixed(6)},{' '}
                  {Number(location.longitude || 0).toFixed(6)}
                  <br />
                  <small>
                    Accuracy: {Number(location.accuracy || 0).toFixed(0)} meters
                  </small>
                </Alert>
              )}

              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button
                  variant="outline-primary"
                  onClick={getLocation}
                  disabled={marking}
                >
                  <FaMapMarkerAlt className="me-2" />
                  Get Location
                </Button>

                <Button
                  variant="success"
                  onClick={markAttendance}
                  disabled={!location || marking}
                >
                  {marking ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Marking...
                    </>
                  ) : (
                    '✅ Mark Attendance'
                  )}
                </Button>
              </div>

              <hr className="my-3" />

              <small className="text-muted">
                📍 Institute Location:{' '}
                {process.env.REACT_APP_INSTITUTE_LATITUDE},{' '}
                {process.env.REACT_APP_INSTITUTE_LONGITUDE}
              </small>
            </Card.Body>
          </Card>

          {statistics && (
            <Row className="mb-4">
              <Col md={3} sm={6}>
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <h6 className="text-muted">Total Days</h6>
                    <h3>{statistics.totalDays}</h3>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} sm={6}>
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <h6 className="text-success">Present</h6>
                    <h3 className="text-success">
                      {statistics.presentDays}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} sm={6}>
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <h6 className="text-danger">Absent</h6>
                    <h3 className="text-danger">
                      {statistics.absentDays}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3} sm={6}>
                <Card className="text-center shadow-sm">
                  <Card.Body>
                    <h6 className="text-primary">Percentage</h6>
                    <h3 className="text-primary">
                      {statistics.attendancePercentage != null
                        ? Number(statistics.attendancePercentage).toFixed(2)
                        : '0.00'}
                      %
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          <Card className="shadow-sm">
            <Card.Header className="fw-bold">
              Attendance History
            </Card.Header>

            <Card.Body>
              {attendanceHistory.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Check-in Time</th>
                        <th>Location</th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendanceHistory.map((record, index) => (
                        <tr key={index}>
                          <td>
                            {moment(record.date).format('DD MMM YYYY')}
                          </td>

                          <td>
                            {getStatusBadge(record.status)}
                          </td>

                          <td>
                            {moment(record.checkInTime).format('hh:mm A')}
                          </td>

                          <td>
                            {record.location &&
                            record.location.latitude != null &&
                            record.location.longitude != null ? (
                              <small className="text-muted">
                                {Number(record.location.latitude).toFixed(4)},{' '}
                                {Number(record.location.longitude).toFixed(4)}
                              </small>
                            ) : (
                              'N/A'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-center text-muted py-3">
                  No attendance records found
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentAttendance;