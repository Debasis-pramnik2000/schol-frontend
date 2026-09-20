
import React, { useState, useEffect } from 'react';

import {
  Nav,
  Button,
  Offcanvas,
  Badge
} from 'react-bootstrap';

import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaSchool,
  FaBook,
  FaCalendarAlt,
  FaChartLine,
  FaClipboardList,
  FaBell,
  FaUserCog,
  FaSignOutAlt,
  FaBars,
  FaFileAlt,
  FaCheckCircle,
  FaTachometerAlt,
  FaEdit,
  FaUpload,
  FaDownload,
  FaCog,
  FaUserFriends,
  FaFilePdf,
  FaCalendarCheck,
  FaUser,
  FaUserPlus,
  FaUsers
} from 'react-icons/fa';

import {
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [show, setShow] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShow(false);
  };

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  // ==================== ADMIN MENU ITEMS ====================

  const adminMenuItems = [
    {
      path: '/admin/dashboard',
      icon: <FaTachometerAlt />,
      label: 'Dashboard',
      roles: ['admin']
    },
    {
      path: '/admin/admissions',
      icon: <FaUserPlus />,
      label: 'Admissions',
      roles: ['admin']
    },
    {
      path: '/admin/students',
      icon: <FaUserGraduate />,
      label: 'Students',
      roles: ['admin']
    },
    {
      path: '/admin/parents',
      icon: <FaUserFriends />,
      label: 'Parents',
      roles: ['admin']
    },
    {
      path: '/admin/teachers',
      icon: <FaChalkboardTeacher />,
      label: 'Teachers',
      roles: ['admin']
    },
    {
      path: '/admin/classes',
      icon: <FaSchool />,
      label: 'Classes',
      roles: ['admin']
    },
    {
      path: '/admin/subjects',
      icon: <FaBook />,
      label: 'Subjects',
      roles: ['admin']
    },
    {
      path: '/admin/timetable',
      icon: <FaCalendarAlt />,
      label: 'Timetable',
      roles: ['admin']
    },
    {
      path: '/admin/attendance-reports',
      icon: <FaChartLine />,
      label: 'Attendance Reports',
      roles: ['admin']
    },
    {
      path: '/admin/exams',
      icon: <FaClipboardList />,
      label: 'Exams',
      roles: ['admin']
    },
    {
      path: '/admin/notices',
      icon: <FaBell />,
      label: 'Notices',
      roles: ['admin']
    },
    {
      path: '/admin/leaves',
      icon: <FaCalendarCheck />,
      label: 'Leave Management',
      roles: ['admin']
    },
    {
      path: '/admin/profile',
      icon: <FaUserCog />,
      label: 'Profile',
      roles: ['admin']
    }
  ];

  // ==================== TEACHER MENU ITEMS ====================

  const teacherMenuItems = [
    {
      path: '/teacher/dashboard',
      icon: <FaTachometerAlt />,
      label: 'Dashboard',
      roles: ['teacher']
    },
    {
      path: '/teacher/classes',
      icon: <FaSchool />,
      label: 'My Classes',
      roles: ['teacher']
    },
    {
      path: '/teacher/attendance',
      icon: <FaCheckCircle />,
      label: 'Mark Attendance',
      roles: ['teacher']
    },
    {
      path: '/teacher/attendance-report',
      icon: <FaChartLine />,
      label: 'Attendance Report',
      roles: ['teacher']
    },
    {
      path: '/teacher/marks',
      icon: <FaEdit />,
      label: 'Enter Marks',
      roles: ['teacher']
    },
    {
      path: '/teacher/materials',
      icon: <FaUpload />,
      label: 'Study Materials',
      roles: ['teacher']
    },
    {
      path: '/teacher/timetable',
      icon: <FaCalendarAlt />,
      label: 'My Timetable',
      roles: ['teacher']
    },
    {
      path: '/teacher/students',
      icon: <FaUsers />,
      label: 'My Students',
      roles: ['teacher']
    },
    {
      path: '/teacher/leaves',
      icon: <FaCalendarCheck />,
      label: 'My Leaves',
      roles: ['teacher']
    },
    {
      path: '/teacher/notices',
      icon: <FaBell />,
      label: 'Notices',
      roles: ['teacher']
    },
    {
      path: '/teacher/profile',
      icon: <FaUserCog />,
      label: 'Profile',
      roles: ['teacher']
    }
  ];

  // ==================== STUDENT MENU ITEMS ====================

  const studentMenuItems = [
    {
      path: '/student/dashboard',
      icon: <FaTachometerAlt />,
      label: 'Dashboard',
      roles: ['student']
    },
    {
      path: '/student/attendance',
      icon: <FaCheckCircle />,
      label: 'My Attendance',
      roles: ['student']
    },
    {
      path: '/student/timetable',
      icon: <FaCalendarAlt />,
      label: 'Timetable',
      roles: ['student']
    },
    {
      path: '/student/results',
      icon: <FaFileAlt />,
      label: 'Results',
      roles: ['student']
    },
    {
      path: '/student/report-card',
      icon: <FaFilePdf />,
      label: 'Report Card',
      roles: ['student']
    },
    {
      path: '/student/exams',
      icon: <FaClipboardList />,
      label: 'Exam Schedule',
      roles: ['student']
    },
    {
      path: '/student/materials',
      icon: <FaDownload />,
      label: 'Study Materials',
      roles: ['student']
    },
    {
      path: '/student/leaves',
      icon: <FaCalendarCheck />,
      label: 'My Leaves',
      roles: ['student']
    },
    {
      path: '/student/notices',
      icon: <FaBell />,
      label: 'Notices',
      roles: ['student']
    },
    {
      path: '/student/profile',
      icon: <FaUserCog />,
      label: 'Profile',
      roles: ['student']
    }
  ];

  // ==================== PARENT MENU ITEMS ====================

  const parentMenuItems = [
    {
      path: '/parent/dashboard',
      icon: <FaTachometerAlt />,
      label: 'Dashboard',
      roles: ['parent']
    },
    {
      path: '/parent/children',
      icon: <FaUsers />,
      label: 'My Children',
      roles: ['parent']
    },
    {
      path: '/parent/notices',
      icon: <FaBell />,
      label: 'Notices',
      roles: ['parent']
    },
    {
      path: '/parent/profile',
      icon: <FaUserCog />,
      label: 'Profile',
      roles: ['parent']
    }
  ];

  // ==================== GET MENU ITEMS ====================

  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return adminMenuItems;

      case 'teacher':
        return teacherMenuItems;

      case 'student':
        return studentMenuItems;

      case 'parent':
        return parentMenuItems;

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // ==================== CHECK ACTIVE PATH ====================

  const isActive = (path) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(path + '/')
    );
  };

  // ==================== ROLE BADGE COLOR ====================

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'danger';

      case 'teacher':
        return 'success';

      case 'student':
        return 'primary';

      case 'parent':
        return 'warning';

      default:
        return 'secondary';
    }
  };

  // ==================== SIDEBAR CONTENT ====================

  const SidebarContent = () => (
    <div className="sidebar-content">

      {/* User Profile Section */}

      <div className="sidebar-header text-center py-3">

        <div className="profile-image-wrapper">
          <img
            src={
              user?.profilePicture ||
              'https://via.placeholder.com/80'
            }
            alt={user?.name || 'User'}
            className="profile-image"
          />
        </div>

        <h5 className="mt-2 mb-0 text-white">
          {user?.name}
        </h5>

        <Badge
          bg={getRoleBadgeColor(user?.role)}
          className="mt-1"
        >
          {user?.role?.toUpperCase()}
        </Badge>

        <p className="text-muted small mb-0">
          @{user?.username}
        </p>

      </div>

      {/* Navigation Menu */}

      <Nav className="flex-column sidebar-nav">

        {menuItems.map((item, index) => (

          <Nav.Link
            key={index}
            as={Link}
            to={item.path}
            className={`sidebar-link ${
              isActive(item.path) ? 'active' : ''
            }`}
            onClick={handleClose}
          >

            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span className="sidebar-label">
              {item.label}
            </span>

          </Nav.Link>

        ))}

      </Nav>

      {/* Divider */}

      <hr className="sidebar-divider" />

      {/* Bottom Links */}

      <Nav className="flex-column sidebar-nav">

        <Nav.Link
          as={Link}
          to={`/${user?.role}/change-password`}
          className="sidebar-link"
          onClick={handleClose}
        >
          <span className="sidebar-icon">
            <FaCog />
          </span>

          <span className="sidebar-label">
            Change Password
          </span>
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/"
          className="sidebar-link"
          onClick={handleClose}
        >
          <span className="sidebar-icon">
            <FaHome />
          </span>

          <span className="sidebar-label">
            Home
          </span>
        </Nav.Link>

        <Nav.Link
          onClick={handleLogout}
          className="sidebar-link text-danger"
        >
          <span className="sidebar-icon">
            <FaSignOutAlt />
          </span>

          <span className="sidebar-label">
            Logout
          </span>
        </Nav.Link>

      </Nav>

      {/* Version Info */}

      <div className="sidebar-footer text-center text-muted small py-2">

        <p className="mb-0">
          Version 1.0.0
        </p>

        <p className="mb-0">
          &copy; 2024 School Management
        </p>

      </div>

    </div>
  );

  return (
    <>

      {/* Mobile Navbar */}

      <div className="mobile-navbar d-lg-none fixed-top">

        <div className="d-flex align-items-center justify-content-between px-3 py-2 bg-primary">

          <span className="text-white fw-bold">
            🏫 School
          </span>

          <Button
            variant="outline-light"
            onClick={handleShow}
            className="border-0"
          >
            <FaBars size={24} />
          </Button>

        </div>

      </div>

      {/* Mobile Offcanvas */}

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        className="sidebar-offcanvas"
      >

        <Offcanvas.Header closeButton>

          <Offcanvas.Title className="text-primary fw-bold">
            🏫 School Management
          </Offcanvas.Title>

        </Offcanvas.Header>

        <Offcanvas.Body className="p-0">
          <SidebarContent />
        </Offcanvas.Body>

      </Offcanvas>

      {/* Desktop Sidebar */}

      {!isMobile && (

        <div className="sidebar-wrapper">

          <div className="sidebar-container">

            <div className="sidebar-brand text-center py-3">

              <h4 className="text-white mb-0">

                <span className="school-icon">
                  🏫
                </span>{' '}
                School

              </h4>

              <small className="text-light opacity-75">
                Management System
              </small>

            </div>

            <SidebarContent />

          </div>

        </div>

      )}

    </>
  );
};

export default Sidebar;

