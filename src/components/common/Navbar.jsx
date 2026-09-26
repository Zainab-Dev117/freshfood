import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function Navbar() {
    const { totalBookmarksCount, setLoginModalOpen, setSignupModalOpen } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleNav = () => setIsOpen(prev => !prev);
    const closeNav = () => setIsOpen(false);

    const handleFindMarketClick = (e) => {
        closeNav();
        if (location.pathname === '/') {
            e.preventDefault();
            const el = document.getElementById('find-market');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/#find-market');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg fresh-navbar sticky-top">
            <div className="container">
                {/* Logo */}
                <Link className="navbar-brand fresh-logo" to="/" onClick={closeNav}>
                    <div className="logo-icon">
                        <i className="fa-solid fa-basket-shopping"></i>
                        <span className="leaf leaf-1"></span>
                        <span className="leaf leaf-2"></span>
                    </div>
                    <div>
                        <h4 className="mb-0">FreshFind</h4>
                        <small>Fresh All Along</small>
                    </div>
                </Link>

                {/* Mobile Hamburger */}
                <button
                    className={`navbar-toggler custom-toggler ${isOpen ? 'open' : ''}`}
                    type="button"
                    onClick={toggleNav}
                    aria-controls="mainNavbar"
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="toggler-icon-bar"></span>
                    <span className="toggler-icon-bar"></span>
                    <span className="toggler-icon-bar"></span>
                </button>

                {/* Navbar Links */}
                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="mainNavbar">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) => `nav-link ${isActive && location.hash !== '#find-market' ? 'active' : ''}`}
                                to="/"
                                end
                                onClick={closeNav}
                            >
                                <i className="fa-solid fa-house me-1"></i> Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#find-market"
                                onClick={handleFindMarketClick}
                            >
                                <i className="fa-solid fa-magnifying-glass-location me-1"></i> Find a Market
                            </a>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                to="/markets"
                                onClick={closeNav}
                            >
                                <i className="fa-solid fa-store me-1"></i> Market Directory
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                to="/produce"
                                onClick={closeNav}
                            >
                                <i className="fa-solid fa-apple-whole me-1"></i> Produce Guide
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                to="/about"
                                onClick={closeNav}
                            >
                                <i className="fa-solid fa-circle-info me-1"></i> About Us
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                to="/contact"
                                onClick={closeNav}
                            >
                                <i className="fa-solid fa-paper-plane me-1"></i> Contact Us
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) => `nav-link nav-bookmarks-link ${isActive ? 'active' : ''}`}
                                to="/bookmarks"
                                onClick={closeNav}
                            >
                                <i className="fa-solid fa-heart me-1 text-danger"></i> Bookmarks
                                {totalBookmarksCount > 0 && (
                                    <span className="bookmarks-count-badge" id="navBookmarksCount">
                                        {totalBookmarksCount}
                                    </span>
                                )}
                            </NavLink>
                        </li>
                    </ul>

                    {/* Right Actions */}
                    <div className="navbar-actions d-flex align-items-center gap-2">
                        <button
                            className="btn btn-outline-fresh login-btn-trigger"
                            type="button"
                            onClick={() => {
                                closeNav();
                                setLoginModalOpen(true);
                            }}
                        >
                            <i className="fa-solid fa-arrow-right-to-bracket me-1"></i> Login
                        </button>
                        <button
                            className="btn btn-fresh signup-btn-trigger"
                            type="button"
                            onClick={() => {
                                closeNav();
                                setSignupModalOpen(true);
                            }}
                        >
                            <i className="fa-solid fa-user-plus me-1"></i> Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
