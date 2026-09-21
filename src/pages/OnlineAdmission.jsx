import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";

import { 
  FaUser, FaCalendarAlt, FaPhone, FaIdCard, FaMapMarkerAlt, 
  FaGraduationCap, FaCamera, FaFileUpload, FaCheckCircle,
  FaSchool, FaUserPlus, FaClipboardList
} from 'react-icons/fa';
import api from '../../services/api';
import { toast } from 'react-toastify';

const OnlineAdmission = () => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState(null);

  const [formData, setFormData] = useState({
    // Personal Information
    studentName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    mobile: '',
    alternateMobile: '',
    
    // Aadhaar
    aadhaarNumber: '',
    
    // Address
    street: '',
    city: '',
    state: '',
    pincode: '',
    
    // Class
    applyingForClass: '',
    section: 'A',
    
    // Education
    lastQualification: '',
    previousSchool: '',
    lastClassPassed: '',
    percentage: '',
    yearOfPassing: ''
  });

  const [files, setFiles] = useState({
    studentPhoto: null,
    aadhaarCard: null,
    leavingCertificate: null,
    marksheet: null
  });

  // ✅ Calculate Age from DOB
  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // ✅ Auto-calculate age when DOB changes
    if (name === 'dateOfBirth') {
      const age = calculateAge(value);
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }

    // ✅ Format Aadhaar (only digits, max 12)
    if (name === 'aadhaarNumber') {
      const digits = value.replace(/\D/g, '').slice(0, 12);
      setFormData(prev => ({ ...prev, aadhaarNumber: digits }));
    }

    // ✅ Format Mobile (only digits, max 10)
    if (name === 'mobile' || name === 'alternateMobile') {
      const digits = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: digits }));
    }

    // ✅ Format Pincode (only digits, max 6)
    if (name === 'pincode') {
      const digits = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, pincode: digits }));
    }

    setError('');
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];

    if (!file) return;

    // ✅ Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${name} file size must be less than 5MB`);
      e.target.value = '';
      return;
    }

    // ✅ Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP images and PDF files are allowed');
      e.target.value = '';
      return;
    }

    setFiles(prev => ({
      ...prev,
      [name]: file
    }));

    // ✅ Show preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === 'studentPhoto') setPhotoPreview(reader.result);
        if (name === 'aadhaarCard') setAadhaarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    // Required fields
    const required = [
      'studentName', 'fatherName', 'dateOfBirth', 'gender',
      'mobile', 'aadhaarNumber', 'street', 'city', 'state',
      'pincode', 'applyingForClass', 'lastQualification',
      'previousSchool', 'lastClassPassed', 'percentage', 'yearOfPassing'
    ];

    for (const field of required) {
      if (!formData[field] || formData[field].toString().trim() === '') {
        toast.error(`Please fill ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Aadhaar validation
    if (formData.aadhaarNumber.length !== 12) {
      toast.error('Aadhaar number must be 12 digits');
      return false;
    }

    // Mobile validation
    if (formData.mobile.length !== 10) {
      toast.error('Mobile number must be 10 digits');
      return false;
    }

    // Pincode validation
    if (formData.pincode.length !== 6) {
      toast.error('Pincode must be 6 digits');
      return false;
    }

    // Age validation
    if (parseInt(formData.age) < 3 || parseInt(formData.age) > 25) {
      toast.error('Age must be between 3 and 25');
      return false;
    }

    // Percentage validation
    if (parseFloat(formData.percentage) < 0 || parseFloat(formData.percentage) > 100) {
      toast.error('Percentage must be between 0 and 100');
      return false;
    }

    // File validations
    if (!files.studentPhoto) {
      toast.error('Please upload student photo');
      return false;
    }
    if (!files.aadhaarCard) {
      toast.error('Please upload Aadhaar card');
      return false;
    }
    if (!files.leavingCertificate) {
      toast.error('Please upload school leaving certificate');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // ✅ Create FormData
      const submitData = new FormData();

      // Personal Info
      submitData.append('studentName', formData.studentName);
      submitData.append('fatherName', formData.fatherName);
      submitData.append('motherName', formData.motherName || '');
      submitData.append('dateOfBirth', formData.dateOfBirth);
      submitData.append('age', formData.age);
      submitData.append('gender', formData.gender);
      submitData.append('mobile', formData.mobile);
      submitData.append('alternateMobile', formData.alternateMobile || '');
      submitData.append('aadhaarNumber', formData.aadhaarNumber);

      // Address (JSON)
      submitData.append('address', JSON.stringify({
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      }));

      // Class
      submitData.append('applyingForClass', formData.applyingForClass);
      submitData.append('section', formData.section);

      // Education
      submitData.append('lastQualification', formData.lastQualification);
      submitData.append('previousSchool', formData.previousSchool);
      submitData.append('lastClassPassed', formData.lastClassPassed);
      submitData.append('percentage', formData.percentage);
      submitData.append('yearOfPassing', formData.yearOfPassing);

      // Files
      submitData.append('studentPhoto', files.studentPhoto);
      submitData.append('aadhaarCard', files.aadhaarCard);
      submitData.append('leavingCertificate', files.leavingCertificate);
      if (files.marksheet) {
        submitData.append('marksheet', files.marksheet);
      }

      // ✅ Submit to API
      const response = await api.post('/api/admission/apply', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setApplicationNumber(response.data.data.applicationNumber);
        setShowSuccess(true);
        toast.success('Application submitted successfully!');
        
        // ✅ Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Submit error:', error);
      const message = error.response?.data?.message || 'Failed to submit application';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '', fatherName: '', motherName: '',
      dateOfBirth: '', age: '', gender: '', mobile: '', alternateMobile: '',
      aadhaarNumber: '', street: '', city: '', state: '', pincode: '',
      applyingForClass: '', section: 'A',
      lastQualification: '', previousSchool: '', lastClassPassed: '',
      percentage: '', yearOfPassing: ''
    });
    setFiles({
      studentPhoto: null, aadhaarCard: null,
      leavingCertificate: null, marksheet: null
    });
    setPhotoPreview(null);
    setAadhaarPreview(null);
    setShowSuccess(false);
  };

  return (
    <div className="online-admission-page">
      {/* Header */}
      <div className="admission-header">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="mb-2">
                <FaUserPlus className="me-3" />
                Online Admission Form
              </h1>
              <p className="mb-0 text-white-50">
                <FaSchool className="me-2" />
                ABC School - Session 2024-2025
              </p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Link
                to="/"
                className="btn btn-outline-light"
                style={{
                  position: "fixed",
                  right: "20px",
                  top: "20px",
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <FaHome /> Back to Home
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')}>
            <strong>Error:</strong> {error}
          </Alert>
        )}

        {/* Info Alert */}
        <Alert variant="info">
          <FaClipboardList className="me-2" />
          <strong>Note:</strong> Fields marked with <span className="text-danger">*</span> are required.
          Please fill all information carefully.
        </Alert>

        <Form onSubmit={handleSubmit}>
          {/* ==================== SECTION 1: PERSONAL INFO ==================== */}
          <Card className="shadow-sm mb-4 admission-card">
            <Card.Header className="bg-primary text-white">
              <FaUser className="me-2" />
              <strong>Section 1: Personal Information</strong>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Student Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Father's Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder="Enter father's name"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mother's Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      placeholder="Enter mother's name (optional)"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaCalendarAlt className="me-1" />
                      Date of Birth <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Age (Auto)</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.age}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaPhone className="me-1" />
                      Mobile <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Alternate Mobile</Form.Label>
                    <Form.Control
                      type="tel"
                      name="alternateMobile"
                      value={formData.alternateMobile}
                      onChange={handleChange}
                      placeholder="Optional"
                      maxLength={10}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* ==================== SECTION 2: AADHAAR ==================== */}
          <Card className="shadow-sm mb-4 admission-card">
            <Card.Header className="bg-info text-white">
              <FaIdCard className="me-2" />
              <strong>Section 2: Aadhaar Information</strong>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Aadhaar Number <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleChange}
                      placeholder="12-digit Aadhaar number"
                      maxLength={12}
                      required
                    />
                    <Form.Text className="text-muted">
                      {formData.aadhaarNumber.length}/12 digits
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* ==================== SECTION 3: ADDRESS ==================== */}
          <Card className="shadow-sm mb-4 admission-card">
            <Card.Header className="bg-success text-white">
              <FaMapMarkerAlt className="me-2" />
              <strong>Section 3: Address</strong>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Street Address <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="House no, Street name, Area"
                  required
                />
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>City <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>State <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pincode <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* ==================== SECTION 4: CLASS INFO ==================== */}
          <Card className="shadow-sm mb-4 admission-card">
            <Card.Header className="bg-warning text-dark">
              <FaGraduationCap className="me-2" />
              <strong>Section 4: Class Information</strong>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Applying for Class <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="applyingForClass"
                      value={formData.applyingForClass}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Class</option>
                      <option value="Class V">Class V</option>
                      <option value="Class VI">Class VI</option>
                      <option value="Class VII">Class VII</option>
                      <option value="Class VIII">Class VIII</option>
                      <option value="Class IX">Class IX</option>
                      <option value="Class X">Class X</option>
                      <option value="Class XI">Class XI</option>
                      <option value="Class XII">Class XII</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Preferred Section</Form.Label>
                    <Form.Select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* ==================== SECTION 5: EDUCATION ==================== */}
          <Card className="shadow-sm mb-4 admission-card">
            <Card.Header className="bg-secondary text-white">
              <FaGraduationCap className="me-2" />
              <strong>Section 5: Education Information</strong>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Qualification <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="lastQualification"
                      value={formData.lastQualification}
                      onChange={handleChange}
                      placeholder="e.g., Class VIII"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Previous School <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleChange}
                      placeholder="School name"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Class Passed <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="lastClassPassed"
                      value={formData.lastClassPassed}
                      onChange={handleChange}
                      placeholder="e.g., Class VIII"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Percentage/Grade <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="number"
                      name="percentage"
                      value={formData.percentage}
                      onChange={handleChange}
                      placeholder="e.g., 85.5"
                      min="0"
                      max="100"
                      step="0.01"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Year of Passing <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="yearOfPassing"
                      value={formData.yearOfPassing}
                      onChange={handleChange}
                      placeholder="e.g., 2023"
                      maxLength={4}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* ==================== SECTION 6: DOCUMENTS ==================== */}
          <Card className="shadow-sm mb-4 admission-card">
            <Card.Header className="bg-danger text-white">
              <FaFileUpload className="me-2" />
              <strong>Section 6: Document Upload</strong>
            </Card.Header>
            <Card.Body>
              <Alert variant="warning" className="py-2 mb-3">
                <small>
                  <strong>Max 5MB per file.</strong> Allowed: JPG, PNG, WEBP, PDF
                </small>
              </Alert>

              <Row>
                {/* Student Photo */}
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>
                      <FaCamera className="me-1" />
                      Student Photo <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="studentPhoto"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/jpg,image/webp"
                      required
                    />
                    {photoPreview && (
                      <div className="mt-2 text-center">
                        <img 
                          src={photoPreview} 
                          alt="Preview" 
                          className="img-thumbnail"
                          style={{ maxHeight: '120px' }}
                        />
                      </div>
                    )}
                  </Form.Group>
                </Col>

                {/* Aadhaar Card */}
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label>
                      <FaIdCard className="me-1" />
                      Aadhaar Card <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="aadhaarCard"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
                      required
                    />
                    {aadhaarPreview && (
                      <div className="mt-2 text-center">
                        <img 
                          src={aadhaarPreview} 
                          alt="Preview" 
                          className="img-thumbnail"
                          style={{ maxHeight: '120px' }}
                        />
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                {/* Leaving Certificate */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaFileUpload className="me-1" />
                      School Leaving Certificate <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="leavingCertificate"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Marksheet */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaFileUpload className="me-1" />
                      Previous Marksheet (Optional)
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="marksheet"
                      onChange={handleFileChange}
                      accept="image/jpeg,image/png,image/jpg,image/webp,application/pdf"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* ==================== SUBMIT BUTTON ==================== */}
          <Card className="shadow-sm mb-4 admission-card">
            <Card.Body className="text-center py-4">
              <p className="text-muted mb-3">
                By submitting this form, you agree that all information provided is correct.
              </p>
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="px-5 py-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="me-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </Card.Body>
          </Card>
        </Form>
      </Container>

      {/* ==================== SUCCESS MODAL ==================== */}
      <Modal 
        show={showSuccess} 
        onHide={() => setShowSuccess(false)}
        centered
        backdrop="static"
      >
        <Modal.Body className="text-center py-5">
          <div className="success-icon mb-3">
            <FaCheckCircle size={80} className="text-success" />
          </div>
          <h3 className="text-success mb-3">Application Submitted!</h3>
          <p className="text-muted mb-4">
            Your application has been submitted successfully.
          </p>
          
          <Card className="bg-light mb-4">
            <Card.Body>
              <h6 className="text-muted mb-2">Your Application Number</h6>
              <h3 className="text-primary mb-0">{applicationNumber}</h3>
            </Card.Body>
          </Card>

          <Alert variant="warning" className="text-start">
            <strong>⚠️ Important:</strong> Please save this Application Number
            for future reference. You can use it to check your application status.
          </Alert>

          <div className="d-grid gap-2">
            <Link to={`/application-status?appNo=${applicationNumber}`}>
              <Button variant="primary" className="w-100">
                Check Application Status
              </Button>
            </Link>
            <Button 
              variant="outline-secondary" 
              onClick={resetForm}
              className="w-100"
            >
              Submit Another Application
            </Button>
            <Link to="/">
              <Button variant="link" className="w-100">
                Back to Home
              </Button>
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OnlineAdmission;