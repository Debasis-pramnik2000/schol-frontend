import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './NavigationBar.css';

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
      sticky="top"
      className="navbar-main"
    >
      <Container fluid className="navbar-container">

        {/* School Name - Desktop Only */}
        <Navbar.Brand as={Link} to="/" className="fw-bold school-name">
          🏫 Mansinghaberh Banishree Vidyaniketan
        </Navbar.Brand>

        {/* Navigation */}
        <Nav className="navbar-menu">

          {/* Home */}
          <Nav.Link as={Link} to="/" className="fw-bold nav-item-custom">
            <FaHome className="nav-icon" />
            <span>Home</span>
          </Nav.Link>

          {/* About - Desktop Only */}
          <Nav.Link as={Link} to="/about" className="fw-bold nav-item-custom desktop-only">
            <FaInfoCircle className="nav-icon" />
            <span>About</span>
          </Nav.Link>

          {/* Apply Online - Desktop Only */}
          <Nav.Link as={Link} to="/apply-online" className="fw-bold nav-item-custom desktop-only">
            <FaUserPlus className="nav-icon" />
            <span>Apply Online admission</span>
          </Nav.Link>

          {/* Check Status */}
          <Nav.Link as={Link} to="/application-status" className="fw-bold nav-item-custom">
            <FaSearch className="nav-icon" />
            <span>Check Status</span>
          </Nav.Link>

          {/* Login */}
          {!isAuthenticated && (
            <Nav.Link as={Link} to="/login" className="fw-bold nav-item-custom">
              <FaUser className="nav-icon" />
              <span>Login</span>
            </Nav.Link>
          )}

        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;