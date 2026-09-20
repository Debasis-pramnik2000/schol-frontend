import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Badge,
  Tab,
  Tabs
} from 'react-bootstrap';

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCopy,
  FaClock,
  FaUserTie,
  
} from 'react-icons/fa';

import axios from 'axios';
import { toast } from 'react-toastify';

const AdminTimetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [activeTab, setActiveTab] = useState('view');

  const [formData, setFormData] = useState({
    class: '',
    section: 'A',
    day: 'Monday',
    periods: [
      {
        periodNumber: 1,
        subject: '',
        subjectCode: '',
        teacher: '',
        startTime: '09:00',
        endTime: '09:45',
        room: ''
      },
      {
        periodNumber: 2,
        subject: '',
        subjectCode: '',
        teacher: '',
        startTime: '09:45',
        endTime: '10:30',
        room: ''
      },
      {
        periodNumber: 3,
        subject: '',
        subjectCode: '',
        teacher: '',
        startTime: '10:45',
        endTime: '11:30',
        room: ''
      },
      {
        periodNumber: 4,
        subject: '',
        subjectCode: '',
        teacher: '',
        startTime: '11:30',
        endTime: '12:15',
        room: ''
      },
      {
        periodNumber: 5,
        subject: '',
        subjectCode: '',
        teacher: '',
        startTime: '12:15',
        endTime: '13:00',
        room: ''
      },
      {
        periodNumber: 6,
        subject: '',
        subjectCode: '',
        teacher: '',
        startTime: '14:00',
        endTime: '14:45',
        room: ''
      },
      {
        periodNumber: 7,
        subject: '',
        subjectCode: '',
        teacher: '',
        startTime: '14:45',
        endTime: '15:30',
        room: ''
      },
      {
        periodNumber: 8,
        subject: '',
        subjectCode: '',
        teacher: '',
        startTime: '15:30',
        endTime: '16:15',
        room: ''
      }
    ],
    academicYear: new Date().getFullYear().toString()
  });

  const [copyData, setCopyData] = useState({
    fromClass: '',
    fromSection: 'A',
    toClass: '',
    toSection: 'A',
    academicYear: new Date().getFullYear().toString()
  });

  const [submitting, setSubmitting] = useState(false);

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  useEffect(() => {
    fetchTimetables();
    fetchClasses();
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTimetables = async () => {
    try {
      setLoading(true);

      const response = await axios.get('/api/admin/timetable');

      setTimetables(response.data.data);
    } catch (error) {
      console.error('Error fetching timetables:', error);
      setError('Failed to load timetables');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/api/admin/classes');

      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/admin/teachers?limit=100');

      setTeachers(response.data.data.teachers || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePeriodChange = (index, field, value) => {
    const periods = [...formData.periods];

    periods[index][field] = value;

    setFormData({
      ...formData,
      periods
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const filteredPeriods = formData.periods.filter(
        (p) => p.subject && p.subject.trim() !== ''
      );

      const submitData = {
        ...formData,
        periods: filteredPeriods
      };

      if (editingTimetable) {
        await axios.put(
          `/api/admin/timetable/${editingTimetable._id}`,
          submitData
        );

        toast.success('Timetable updated successfully');
      } else {
        await axios.post('/api/admin/timetable', submitData);

        toast.success('Timetable created successfully');
      }

      setShowModal(false);

      resetForm();

      fetchTimetables();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Operation failed'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this timetable?'
      )
    ) {
      try {
        await axios.delete(`/api/admin/timetable/${id}`);

        toast.success('Timetable deleted successfully');

        fetchTimetables();
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            'Failed to delete timetable'
        );
      }
    }
  };

  const handleCopy = async () => {
    setSubmitting(true);

    try {
      await axios.post(
        '/api/admin/timetable/copy',
        copyData
      );

      toast.success('Timetable copied successfully');

      setShowCopyModal(false);

      fetchTimetables();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Failed to copy timetable'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      class: '',
      section: 'A',
      day: 'Monday',
      periods: [
        {
          periodNumber: 1,
          subject: '',
          subjectCode: '',
          teacher: '',
          startTime: '09:00',
          endTime: '09:45',
          room: ''
        },
        {
          periodNumber: 2,
          subject: '',
          subjectCode: '',
          teacher: '',
          startTime: '09:45',
          endTime: '10:30',
          room: ''
        },
        {
          periodNumber: 3,
          subject: '',
          subjectCode: '',
          teacher: '',
          startTime: '10:45',
          endTime: '11:30',
          room: ''
        },
        {
          periodNumber: 4,
          subject: '',
          subjectCode: '',
          teacher: '',
          startTime: '11:30',
          endTime: '12:15',
          room: ''
        },
        {
          periodNumber: 5,
          subject: '',
          subjectCode: '',
          teacher: '',
          startTime: '12:15',
          endTime: '13:00',
          room: ''
        },
        {
          periodNumber: 6,
          subject: '',
          subjectCode: '',
          teacher: '',
          startTime: '14:00',
          endTime: '14:45',
          room: ''
        },
        {
          periodNumber: 7,
          subject: '',
          subjectCode: '',
          teacher: '',
          startTime: '14:45',
          endTime: '15:30',
          room: ''
        },
        {
          periodNumber: 8,
          subject: '',
          subjectCode: '',
          teacher: '',
          startTime: '15:30',
          endTime: '16:15',
          room: ''
        }
      ],
      academicYear: new Date().getFullYear().toString()
    });

    setEditingTimetable(null);
  };

  const openCreateModal = () => {
    resetForm();

    setShowModal(true);
  };

  const openEditModal = (timetable) => {
    setEditingTimetable(timetable);

    setFormData({
      class: timetable.class,
      section: timetable.section,
      day: timetable.day,

      periods: timetable.periods.map((p) => ({
        periodNumber: p.periodNumber,
        subject: p.subject || '',
        subjectCode: p.subjectCode || '',

        // User._id because Timetable.teacher references User
        teacher:
          typeof p.teacher === 'object'
            ? p.teacher?._id || ''
            : p.teacher || '',

        startTime: p.startTime || '09:00',
        endTime: p.endTime || '09:45',
        room: p.room || ''
      })),

      academicYear: timetable.academicYear
    });

    setShowModal(true);
  };

  const getPeriodsForClass = (className, section, day) => {
    const timetable = timetables.find(
      (t) =>
        t.class === className &&
        t.section === section &&
        t.day === day
    );

    return timetable?.periods || [];
  };

  const getTeacherName = (period) => {
    if (!period) return 'N/A';

    // Backend populated User
    if (
      period.teacher &&
      typeof period.teacher === 'object'
    ) {
      return period.teacher.name || 'N/A';
    }

    const teacherId = period.teacher;

    if (!teacherId) return 'N/A';

    // period.teacher is User._id
    const match = teachers.find(
      (teacher) =>
        teacher.user?._id === teacherId
    );

    return match?.user?.name || 'N/A';
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />

        <p className="mt-3">
          Loading timetables...
        </p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Timetable Management</h2>

            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                onClick={() =>
                  setShowCopyModal(true)
                }
              >
                <FaCopy className="me-2" />
                Copy Timetable
              </Button>

              <Button
                variant="primary"
                onClick={openCreateModal}
              >
                <FaPlus className="me-2" />
                Create Timetable
              </Button>
            </div>
          </div>

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab
              eventKey="view"
              title="View Timetable"
            >
              <Card className="shadow-sm">
                <Card.Body>
                  {error && (
                    <Alert variant="danger">
                      {error}
                    </Alert>
                  )}

                  <Row className="mb-4">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          Filter by Class
                        </Form.Label>

                        <Form.Select
                          value={selectedClass}
                          onChange={(e) =>
                            setSelectedClass(
                              e.target.value
                            )
                          }
                        >
                          <option value="">
                            All Classes
                          </option>

                          {classes.map((cls) => (
                            <option
                              key={cls._id}
                              value={cls.className}
                            >
                              {cls.className} -{' '}
                              {cls.section}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>
                          Section
                        </Form.Label>

                        <Form.Select
                          value={selectedSection}
                          onChange={(e) =>
                            setSelectedSection(
                              e.target.value
                            )
                          }
                        >
                          <option value="A">
                            A
                          </option>
                          <option value="B">
                            B
                          </option>
                          <option value="C">
                            C
                          </option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  {days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="mb-4"
                    >
                      <h5 className="bg-primary text-white p-2 rounded">
                        <FaClock className="me-2" />
                        {day}
                      </h5>

                      <div className="table-responsive">
                        <Table
                          striped
                          bordered
                          hover
                        >
                          <thead>
                            <tr>
                              <th>Period</th>

                              {classes
                                .filter(
                                  (c) =>
                                    !selectedClass ||
                                    c.className ===
                                      selectedClass
                                )
                                .map((cls) => (
                                  <th
                                    key={cls._id}
                                  >
                                    {cls.className}-
                                    {cls.section}
                                  </th>
                                ))}
                            </tr>
                          </thead>

                          <tbody>
                            {[
                              1, 2, 3, 4, 5, 6, 7, 8
                            ].map((periodNum) => (
                              <tr
                                key={periodNum}
                              >
                                <td className="fw-bold">
                                  Period {periodNum}
                                </td>

                                {classes
                                  .filter(
                                    (c) =>
                                      !selectedClass ||
                                      c.className ===
                                        selectedClass
                                  )
                                  .map((cls) => {
                                    const periods =
                                      getPeriodsForClass(
                                        cls.className,
                                        cls.section,
                                        day
                                      );

                                    const period =
                                      periods.find(
                                        (p) =>
                                          p.periodNumber ===
                                          periodNum
                                      );

                                    return (
                                      <td
                                        key={cls._id}
                                      >
                                        {period ? (
                                          <div className="p-1">
                                            <div className="fw-bold">
                                              {
                                                period.subject
                                              }
                                            </div>

                                            <small className="text-muted">
                                              <FaUserTie className="me-1" />

                                              {getTeacherName(
                                                period
                                              )}
                                            </small>

                                            <br />

                                            <small className="text-muted">
                                              {
                                                period.startTime
                                              }{' '}
                                              -{' '}
                                              {
                                                period.endTime
                                              }
                                            </small>
                                          </div>
                                        ) : (
                                          <span className="text-muted">
                                            -
                                          </span>
                                        )}
                                      </td>
                                    );
                                  })}
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Tab>

            <Tab
              eventKey="list"
              title="All Timetables"
            >
              <Card className="shadow-sm">
                <Card.Body>
                  <div className="table-responsive">
                    <Table striped hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Class</th>
                          <th>Section</th>
                          <th>Day</th>
                          <th>Periods</th>
                          <th>Academic Year</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {timetables.map(
                          (timetable, index) => (
                            <tr
                              key={timetable._id}
                            >
                              <td>{index + 1}</td>

                              <td>
                                {timetable.class}
                              </td>

                              <td>
                                {timetable.section}
                              </td>

                              <td>
                                {timetable.day}
                              </td>

                              <td>
                                <Badge bg="info">
                                  {timetable.periods
                                    ?.length || 0}{' '}
                                  Periods
                                </Badge>
                              </td>

                              <td>
                                {
                                  timetable.academicYear
                                }
                              </td>

                              <td>
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() =>
                                      openEditModal(
                                        timetable
                                      )
                                    }
                                  >
                                    <FaEdit />
                                  </Button>

                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() =>
                                      handleDelete(
                                        timetable._id
                                      )
                                    }
                                  >
                                    <FaTrash />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTimetable
              ? 'Edit Timetable'
              : 'Create New Timetable'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Class *
                  </Form.Label>

                  <Form.Select
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Class
                    </option>

                    {classes.map((cls) => (
                      <option
                        key={cls._id}
                        value={cls.className}
                      >
                        {cls.className}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Section
                  </Form.Label>

                  <Form.Select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                  >
                    <option value="A">
                      A
                    </option>
                    <option value="B">
                      B
                    </option>
                    <option value="C">
                      C
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Day *
                  </Form.Label>

                  <Form.Select
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    required
                  >
                    {days.map((day) => (
                      <option
                        key={day}
                        value={day}
                      >
                        {day}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Academic Year
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="academicYear"
                    value={
                      formData.academicYear
                    }
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h6 className="mt-3">
              Periods
            </h6>

            <div className="table-responsive">
              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Subject</th>
                    <th>Code</th>
                    <th>Teacher</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Room</th>
                  </tr>
                </thead>

                <tbody>
                  {formData.periods.map(
                    (period, index) => (
                      <tr key={index}>
                        <td className="text-center fw-bold">
                          {period.periodNumber}
                        </td>

                        <td>
                          <Form.Control
                            type="text"
                            placeholder="Subject"
                            value={
                              period.subject
                            }
                            onChange={(e) =>
                              handlePeriodChange(
                                index,
                                'subject',
                                e.target.value
                              )
                            }
                            size="sm"
                          />
                        </td>

                        <td>
                          <Form.Control
                            type="text"
                            placeholder="Code"
                            value={
                              period.subjectCode
                            }
                            onChange={(e) =>
                              handlePeriodChange(
                                index,
                                'subjectCode',
                                e.target.value.toUpperCase()
                              )
                            }
                            size="sm"
                            style={{
                              width: '80px'
                            }}
                          />
                        </td>

                        <td>
                          <Form.Select
                            value={
                              period.teacher
                            }
                            onChange={(e) =>
                              handlePeriodChange(
                                index,
                                'teacher',
                                e.target.value
                              )
                            }
                            size="sm"
                          >
                            <option value="">
                              Select
                            </option>

                            {teachers.map(
                              (teacher) => (
                                <option
                                  key={
                                    teacher._id
                                  }

                                  // FIX:
                                  // Timetable.teacher references User
                                  // So save Teacher.user._id
                                  value={
                                    teacher.user?._id ||
                                    ''
                                  }
                                >
                                  {teacher.user?.name ||
                                    'Unknown Teacher'}
                                </option>
                              )
                            )}
                          </Form.Select>
                        </td>

                        <td>
                          <Form.Control
                            type="time"
                            value={
                              period.startTime
                            }
                            onChange={(e) =>
                              handlePeriodChange(
                                index,
                                'startTime',
                                e.target.value
                              )
                            }
                            size="sm"
                          />
                        </td>

                        <td>
                          <Form.Control
                            type="time"
                            value={
                              period.endTime
                            }
                            onChange={(e) =>
                              handlePeriodChange(
                                index,
                                'endTime',
                                e.target.value
                              )
                            }
                            size="sm"
                          />
                        </td>

                        <td>
                          <Form.Control
                            type="text"
                            placeholder="Room"
                            value={
                              period.room
                            }
                            onChange={(e) =>
                              handlePeriodChange(
                                index,
                                'room',
                                e.target.value
                              )
                            }
                            size="sm"
                          />
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() =>
                setShowModal(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : editingTimetable
                ? 'Update'
                : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Copy Modal */}
      <Modal
        show={showCopyModal}
        onHide={() =>
          setShowCopyModal(false)
        }
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Copy Timetable
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <h6>Source</h6>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Class
                  </Form.Label>

                  <Form.Select
                    value={
                      copyData.fromClass
                    }
                    onChange={(e) =>
                      setCopyData({
                        ...copyData,
                        fromClass:
                          e.target.value
                      })
                    }
                  >
                    <option value="">
                      Select
                    </option>

                    {classes.map((cls) => (
                      <option
                        key={cls._id}
                        value={cls.className}
                      >
                        {cls.className}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Section
                  </Form.Label>

                  <Form.Select
                    value={
                      copyData.fromSection
                    }
                    onChange={(e) =>
                      setCopyData({
                        ...copyData,
                        fromSection:
                          e.target.value
                      })
                    }
                  >
                    <option value="A">
                      A
                    </option>
                    <option value="B">
                      B
                    </option>
                    <option value="C">
                      C
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <h6>Target</h6>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Class
                  </Form.Label>

                  <Form.Select
                    value={
                      copyData.toClass
                    }
                    onChange={(e) =>
                      setCopyData({
                        ...copyData,
                        toClass:
                          e.target.value
                      })
                    }
                  >
                    <option value="">
                      Select
                    </option>

                    {classes.map((cls) => (
                      <option
                        key={cls._id}
                        value={cls.className}
                      >
                        {cls.className}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Section
                  </Form.Label>

                  <Form.Select
                    value={
                      copyData.toSection
                    }
                    onChange={(e) =>
                      setCopyData({
                        ...copyData,
                        toSection:
                          e.target.value
                      })
                    }
                  >
                    <option value="A">
                      A
                    </option>
                    <option value="B">
                      B
                    </option>
                    <option value="C">
                      C
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>
                Academic Year
              </Form.Label>

              <Form.Control
                type="text"
                value={
                  copyData.academicYear
                }
                onChange={(e) =>
                  setCopyData({
                    ...copyData,
                    academicYear:
                      e.target.value
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() =>
              setShowCopyModal(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleCopy}
            disabled={submitting}
          >
            {submitting
              ? 'Copying...'
              : 'Copy Timetable'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminTimetable;