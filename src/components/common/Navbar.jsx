import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMediaQuery } from 'react-responsive';

import {
  FaUser,
  FaHome,
  FaUserPlus,
  FaSearch,
  FaInfoCircle
} from 'react-icons/fa';

const NavigationBar = () => {
  const { isAuthenticated } = useAuth();

  // Detect mobile (≤ 991px)
  const isMobile = useMediaQuery({ maxWidth: 991 });

  return (
    <>
      <Navbar
        bg="primary"
        variant="dark"
        sticky="top"
        className="navbar-main"
      >
        <Container fluid className="navbar-container">

          {/* School Name - Desktop Only */}
          {!isMobile && (
            <Navbar.Brand as={Link} to="/" className="fw-bold school-name">
              🏫 Mansinghaberh Banishree Vidyaniketan
            </Navbar.Brand>
          )}

          {/* Navigation */}
          <Nav className="navbar-menu">

            {/* Home - Always visible */}
            <Nav.Link as={Link} to="/" className="fw-bold nav-item-custom">
              <FaHome className="nav-icon" />
              <span>Home</span>
            </Nav.Link>

            {/* About - Desktop ONLY */}
            {!isMobile && (
              <Nav.Link as={Link} to="/about" className="fw-bold nav-item-custom">
                <FaInfoCircle className="nav-icon" />
                <span>About</span>
              </Nav.Link>
            )}

            {/* Apply Online - Desktop ONLY */}
            {!isMobile && (
              <Nav.Link as={Link} to="/apply-online" className="fw-bold nav-item-custom">
                <FaUserPlus className="nav-icon" />
                <span>Apply Online admission</span>
              </Nav.Link>
            )}

            {/* Check Status - Always visible */}
            <Nav.Link as={Link} to="/application-status" className="fw-bold nav-item-custom">
              <FaSearch className="nav-icon" />
              <span>Check Status</span>
            </Nav.Link>

            {/* Login - Always visible if not authenticated */}
            {!isAuthenticated && (
              <Nav.Link as={Link} to="/login" className="fw-bold nav-item-custom">
                <FaUser className="nav-icon" />
                <span>Login</span>
              </Nav.Link>
            )}

          </Nav>
        </Container>
      </Navbar>

      <style>
        {`
          .navbar-main {
            width: 100%;
            min-height: 56px;
            z-index: 9999;
          }

          .navbar-container {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            flex-wrap: nowrap !important;
            width: 100%;
          }

          .school-name {
            white-space: nowrap !important;
            flex-shrink: 0 !important;
          }

          .navbar-menu {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            margin-left: auto !important;
            width: auto !important;
          }

          .nav-item-custom {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            color: white !important;
          }

          .nav-icon {
            flex-shrink: 0 !important;
            margin-right: 5px;
          }

          .nav-item-custom span {
            white-space: nowrap !important;
          }

          .nav-item-custom:hover {
            color: white !important;
          }

          /* MOBILE */
          @media (max-width: 991.98px) {
            .navbar-main {
              padding: 7px 0 !important;
              min-height: 55px !important;
            }

            .navbar-container {
              padding-left: 8px !important;
              padding-right: 8px !important;
              justify-content: center !important;
            }

            .navbar-menu {
              display: flex !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              justify-content: center !important;
              align-items: center !important;
              gap: 20px !important;
            }

            .nav-item-custom {
              padding: 5px 6px !important;
              margin: 0 !important;
              font-size: 14px !important;
              line-height: 1 !important;
              flex: 0 0 auto !important;
            }

            .nav-icon {
              font-size: 15px !important;
              margin-right: 4px !important;
            }
          }

          /* SMALL MOBILE */
          @media (max-width: 380px) {
            .navbar-menu {
              gap: 14px !important;
            }

            .nav-item-custom {
              font-size: 13px !important;
              padding: 5px 3px !important;
            }

            .nav-icon {
              font-size: 14px !important;
              margin-right: 3px !important;
            }
          }

          /* VERY SMALL MOBILE */
          @media (max-width: 340px) {
            .navbar-menu {
              gap: 10px !important;
            }

            .nav-item-custom {
              font-size: 12px !important;
              padding-left: 2px !important;
              padding-right: 2px !important;
            }

            .nav-icon {
              font-size: 13px !important;
              margin-right: 2px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default NavigationBar;