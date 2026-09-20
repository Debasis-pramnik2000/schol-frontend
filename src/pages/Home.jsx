import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaInfoCircle } from 'react-icons/fa';
import NoticeTicker from '../components/common/NoticeTicker';

const Home = () => {
  return (
    <div className="home-page-fixed">
      {/* ==================== SPLIT LAYOUT ==================== */}
      <div className="home-split">

        {/* ==================== LEFT SIDE - HERO ==================== */}
        <div className="home-hero">
          {/* Background Photo */}
          <div 
            className="hero-bg"
            style={{
              backgroundImage: 'url(/images/images.jpg)'
            }}
          ></div>

          {/* Dark Overlay */}
          <div className="hero-dark-overlay"></div>

          {/* Content */}
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="text-warning">Mansinghaberh Banishree Vidyaniketan (H.S.)</span>
            </h1>

            <p className="hero-subtitle">
              Excellence in Education Since 1968
            </p>

            <p className="hero-description">
              Empowering students with knowledge, skills, and values for a bright future.
            </p>

            <div className="hero-buttons">
              <Link to="/about">
                <Button variant="warning" size="lg" className="fw-bold hero-btn-login">
                  <FaInfoCircle className="me-2" />
                  About Our School
                </Button>
              </Link>

              <Link to="/apply-online">
                <Button variant="outline-light" size="lg" className="fw-bold hero-btn-apply">
                  <FaUserPlus className="me-2" />
                  Apply Online
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT SIDE - NOTICES ==================== */}
        <div className="home-notices">
          <NoticeTicker />
        </div>

      </div>
    </div>
  );
};

export default Home;