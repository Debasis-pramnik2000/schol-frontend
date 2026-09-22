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
        sticky="top"
        className="navbar-main"
      >
        <Container fluid className="navbar-container">

          {/* School Name - Desktop Only */}
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold school-name"
          >
            🏫 Mansinghaberh Banishree Vidyaniketan
          </Navbar.Brand>

          {/* Navigation */}
          <Nav className="navbar-menu">

            {/* Home - Mobile + Desktop */}
            <Nav.Link
              as={Link}
              to="/"
              className="fw-bold nav-item-custom"
            >
              <FaHome className="nav-icon" />
              <span>Home</span>
            </Nav.Link>

            {/* About - Desktop Only */}
            <Nav.Link
              as={Link}
              to="/about"
              className="fw-bold nav-item-custom desktop-only"
            >
              <FaInfoCircle className="nav-icon" />
              <span>About</span>
            </Nav.Link>

            {/* Apply Online - Desktop Only */}
            <Nav.Link
              as={Link}
              to="/apply-online"
              className="fw-bold nav-item-custom desktop-only"
            >
              <FaUserPlus className="nav-icon" />
              <span>Apply Online admission</span>
            </Nav.Link>

            {/* Check Status - Mobile + Desktop */}
            <Nav.Link
              as={Link}
              to="/application-status"
              className="fw-bold nav-item-custom"
            >
              <FaSearch className="nav-icon" />
              <span>Check Status</span>
            </Nav.Link>

            {/* Login - Mobile + Desktop */}
            {!isAuthenticated && (
              <Nav.Link
                as={Link}
                to="/login"
                className="fw-bold nav-item-custom"
              >
                <FaUser className="nav-icon" />
                <span>Login</span>
              </Nav.Link>
            )}

          </Nav>
        </Container>
      </Navbar>

      <style>
        {`
          /* Main Navbar */
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

          /* School Name */
          .school-name {
            white-space: nowrap !important;
            flex-shrink: 0 !important;
          }

          /* Menu */
          .navbar-menu {
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
            flex-direction: row !important;
            flex-wrap: nowrap !important;
            margin-left: auto !important;
            width: auto !important;
          }

          /* Menu Item */
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

          /* =========================
             MOBILE
          ========================= */
          @media (max-width: 991.98px) {

            .navbar-main {
              padding: 7px 0 !important;
              min-height: 55px !important;
            }

            .navbar-container {
              padding-left: 8px !important;
              padding-right: 8px !important;
              justify-content: center !important;
              overflow: hidden !important;
            }

            /* Hide School Name */
            .school-name {
              display: none !important;
            }

            /* Only Home, Check Status, Login */
            .desktop-only {
              display: none !important;
            }

            .navbar-menu {
              display: flex !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              justify-content: center !important;
              align-items: center !important;
              flex-direction: row !important;
              flex-wrap: nowrap !important;
              gap: 12px !important;
              overflow: hidden !important;
            }

            .nav-item-custom {
              display: flex !important;
              width: auto !important;
              min-width: max-content !important;
              max-width: none !important;
              padding: 5px 4px !important;
              margin: 0 !important;
              font-size: 14px !important;
              line-height: 1 !important;
              white-space: nowrap !important;
              flex: 0 0 auto !important;
            }

            .nav-item-custom span {
              display: inline-block !important;
              white-space: nowrap !important;
            }

            .nav-icon {
              font-size: 15px !important;
              margin-right: 4px !important;
              flex-shrink: 0 !important;
            }
          }

          /* =========================
             SMALL MOBILE
          ========================= */
          @media (max-width: 380px) {

            .navbar-main {
              padding: 6px 0 !important;
            }

            .navbar-container {
              padding-left: 4px !important;
              padding-right: 4px !important;
            }

            .navbar-menu {
              gap: 7px !important;
            }

            .nav-item-custom {
              font-size: 12px !important;
              padding: 5px 2px !important;
            }

            .nav-icon {
              font-size: 13px !important;
              margin-right: 3px !important;
            }
          }

          /* =========================
             VERY SMALL MOBILE
          ========================= */
          @media (max-width: 340px) {

            .navbar-menu {
              gap: 4px !important;
            }

            .nav-item-custom {
              font-size: 11px !important;
              padding-left: 1px !important;
              padding-right: 1px !important;
            }

            .nav-icon {
              font-size: 12px !important;
              margin-right: 2px !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default NavigationBar;