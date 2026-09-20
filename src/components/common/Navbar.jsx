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
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="navbar-main">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🏫 Mansinghaberh Banishree Vidyaniketan        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* ✅ Home */}
            <Nav.Link as={Link} to="/" className="fw-bold">
              <FaHome className="me-1" /> Home
            </Nav.Link>

            {/* ✅ About */}
            <Nav.Link as={Link} to="/about" className="fw-bold">
              <FaInfoCircle className="me-1" /> About
            </Nav.Link>

            {/* ✅ Apply Online */}
            <Nav.Link as={Link} to="/apply-online" className="fw-bold">
              <FaUserPlus className="me-1" /> Apply Online admission
            </Nav.Link>

            {/* ✅ Check Status */}
            <Nav.Link as={Link} to="/application-status" className="fw-bold">
              <FaSearch className="me-1" /> Check Status
            </Nav.Link>

            {/* ✅ Login - Only when not logged in */}
            {!isAuthenticated && (
              <Nav.Link as={Link} to="/login" className="fw-bold">
                <FaUser className="me-1" /> Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;