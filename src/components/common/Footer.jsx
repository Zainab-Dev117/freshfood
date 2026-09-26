import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="site-footer" id="freshfindGlobalFooter">
            <div className="footer-wrapper">
                {/* Brand Section */}
                <div className="footer-brand-col">
                    <Link to="/" className="footer-logo">
                        <div className="d-flex align-items-center gap-2">
                            <div className="logo-icon logo-icon-light">
                                <i className="fa-solid fa-basket-shopping text-white"></i>
                            </div>
                            <h3 className="text-white font-playfair mb-0">FreshFind</h3>
                        </div>
                    </Link>
                    <p className="footer-tagline">Fresh Finds. Local Markets. Better Choices.</p>
                    <p className="footer-desc">
                        Supporting regional growers, artisan producers, and vibrant neighborhood farmers markets.
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="footer-links-col">
                    <h5>Explore</h5>
                    <ul className="footer-nav-list">
                        <li><Link to="/">Home</Link></li>
                        <li><a href="/#find-market">Find a Market</a></li>
                        <li><Link to="/markets">Market Directory</Link></li>
                        <li><Link to="/produce">Produce Guide</Link></li>
                        <li><Link to="/bookmarks">My Bookmarks</Link></li>
                    </ul>
                </div>

                {/* Quick Links & Project Info */}
                <div className="footer-links-col">
                    <h5>Information</h5>
                    <ul className="footer-nav-list">
                        <li><Link to="/about">About FreshFind</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/about#team">Our Team</Link></li>
                        <li><a href="/#seasonal-picks">Seasonal Picks</a></li>
                        <li>
                            <span className="footer-status-pill">
                                <i className="fa-solid fa-circle-check text-success me-1"></i> React Frontend
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Social & Contact */}
                <div className="footer-social-col">
                    <h5>Stay Connected</h5>
                    <div className="footer-socials">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                            <i className="fa-brands fa-facebook"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X">
                            <i className="fa-brands fa-x-twitter"></i>
                        </a>
                        <a href="https://whatsapp.com" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                            <i className="fa-brands fa-whatsapp"></i>
                        </a>
                    </div>
                    <p className="footer-contact-item mt-3">
                        <i className="fa-solid fa-envelope me-2"></i> hello@freshfind.com
                    </p>
                    <p className="footer-contact-item">
                        <i className="fa-solid fa-location-dot me-2"></i> Karachi, Pakistan
                    </p>
                </div>
            </div>

            <div className="footer-bottom-bar">
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center py-3">
                    <small>© 2026 FreshFind — Fresh All Along. All rights reserved.</small>
                    <small className="text-white-50">Designed with passion for local communities.</small>
                </div>
            </div>
        </footer>
    );
}
