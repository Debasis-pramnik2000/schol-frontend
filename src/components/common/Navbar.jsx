
import React from 'react';

import { Navbar, Nav, Container } from 'react-bootstrap';

import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import {
  FaUser,
  FaHome,
  FaUserPlus,
  FaSearch,
  FaInfoCircle
} from 'react-icons/fa';

const NavigationBar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Navbar
      bg="primary"
      variant="dark"
      expand="lg"
      sticky="top"
      className="navbar-main"
    >
      <Container>

        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🏫 Mansinghaberh Banishree Vidyaniketan
        </Navbar.Brand>

        {/* Desktop Navbar */}
        <Nav className="ms-auto">

          {/* Home - Mobile + Desktop */}
          <Nav.Link as={Link} to="/" className="fw-bold">
            <FaHome className="me-1" /> Home
          </Nav.Link>

          {/* About - Desktop only */}
          <Nav.Link
            as={Link}
            to="/about"
            className="fw-bold d-none d-lg-block"
          >
            <FaInfoCircle className="me-1" /> About
          </Nav.Link>

          {/* Apply Online - Desktop only */}
          <Nav.Link
            as={Link}
            to="/apply-online"
            className="fw-bold d-none d-lg-block"
          >
            <FaUserPlus className="me-1" /> Apply Online admission
          </Nav.Link>

          {/* Check Status - Mobile + Desktop */}
          <Nav.Link
            as={Link}
            to="/application-status"
            className="fw-bold"
          >
            <FaSearch className="me-1" /> Check Status
          </Nav.Link>

          {/* Login - Mobile + Desktop */}
          {!isAuthenticated && (
            <Nav.Link
              as={Link}
              to="/login"
              className="fw-bold"
            >
              <FaUser className="me-1" /> Login
            </Nav.Link>
          )}

        </Nav>

      </Container>
    </Navbar>
  );
};

export default NavigationBar;
