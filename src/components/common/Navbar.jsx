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
    <>
      <Navbar
        bg="primary"
        variant="dark"
        expand="lg"
        sticky="top"
        className="navbar-main"
      >
        <Container>

          {/* School Name - Desktop Only */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold school-name"
          >
            🏫 Mansinghab­erh Banishree Vidyaniketan
          </Navbar.Brand>

          <Nav className="ms-auto navbar-menu">

            {/* Home */}
            <Nav.Link
              as={Link}
              to="/"
              className="fw-bold"
            >
              <FaHome className="me-1" />
              Home
            </Nav.Link>

            {/* About - Desktop Only */}
            <Nav.Link
              as={Link}
              to="/about"
              className="fw-bold desktop-only"
            >
              <FaInfoCircle className="me-1" />
              About
            </Nav.Link>

            {/* Apply Online - Desktop Only */}
            <Nav.Link
              as={Link}
              to="/apply-online"
              className="fw-bold desktop-only"
            >
              <FaUserPlus className="me-1" />
              Apply Online admission
            </Nav.Link>

            {/* Check Status */}
            <Nav.Link
              as={Link}
              to="/application-status"
              className="fw-bold"
            >
              <FaSearch className="me-1" />
              Check Status
            </Nav.Link>

            {/* Login */}
            {!isAuthenticated && (
              <Nav.Link
                as={Link}
                to="/login"
                className="fw-bold"
              >
                <FaUser className="me-1" />
                Login
              </Nav.Link>
            )}

          </Nav>
        </Container>
      </Navbar>

      <style>
        {`
          .navbar-main {
            width: 100%;
            z-index: 9999;
          }

          .navbar-menu {
            display: flex;
            align-items: center;
          }

          .navbar-menu .nav-link {
            white-space: nowrap;
            color: rgba(255, 255, 255, 0.95) !important;
          }

          .navbar-menu .nav-link:hover {
            color: #ffffff !important;
          }

          /* Mobile */
          @media (max-width: 991.98px) {

            .school-name {
              display: none !important;
            }

            .navbar-main .container {
              justify-content: center;
            }

            .navbar-menu {
              width: 100%;
              justify-content: center;
              gap: 12px;
              margin-left: 0 !important;
            }

            .navbar-menu .nav-link {
              font-size: 0.9rem;
              padding: 6px 8px !important;
            }

            .desktop-only {
              display: none !important;
            }
          }

          /* Small Mobile */
          @media (max-width: 400px) {

            .navbar-menu {
              gap: 8px;
            }

            .navbar-menu .nav-link {
              font-size: 0.78rem;
              padding: 6px 5px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default NavigationBar;