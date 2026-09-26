import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/common/Breadcrumb';
import MarketMap from '../components/markets/MarketMap';
import { useApp } from '../context/AppContext';

export default function Contact() {
    const { showToast, userCoords, geoStatus, requestUserLocation } = useApp();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        document.title = 'Contact Us — FreshFind';
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        showToast('Thank you for reaching out! We will respond shortly.', 'success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
    };

    // Center map around user location if granted, or Karachi community hub default
    const mapLat = userCoords?.lat || 24.8607;
    const mapLng = userCoords?.lng || 67.0011;
    const mapTitle = userCoords ? 'Your Current Location' : 'FreshFind Community Hub';
    const mapAddress = userCoords ? 'Detected via GPS' : 'Central Hub, Karachi, Pakistan';

    return (
        <main>
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: 'Contact Us', active: true }]} />

            {/* Contact Hero */}
            <section className="py-5 bg-white border-bottom">
                <div className="container">
                    <div className="max-w-800">
                        <span className="badge-pill-fresh mb-2 d-inline-block">LET'S STAY CONNECTED</span>
                        <h1 className="font-playfair text-fresh mb-2 display-6 fw-bold">Contact Our Team</h1>
                        <p className="text-muted lead mb-0">
                            Have questions about local markets, operating schedules, or produce guides? We're here to help you connect with your local community.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-5 bg-light border-bottom">
                <div className="container">
                    <div className="row g-4">
                        {/* Email */}
                        <div className="col-lg-3 col-md-6">
                            <div className="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
                                <div className="text-fresh fs-2 mb-2"><i className="fa-solid fa-envelope"></i></div>
                                <h5 className="fw-bold mb-1">Email Us</h5>
                                <p className="text-muted small mb-2">For inquiries and suggestions</p>
                                <a href="mailto:hello@freshfind.com" className="text-fresh fw-semibold text-decoration-none">
                                    hello@freshfind.com
                                </a>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="col-lg-3 col-md-6">
                            <div className="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
                                <div className="text-fresh fs-2 mb-2"><i className="fa-solid fa-phone"></i></div>
                                <h5 className="fw-bold mb-1">Call Us</h5>
                                <p className="text-muted small mb-2">Monday through Saturday</p>
                                <span className="text-dark fw-semibold">+92 300 1234567</span>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="col-lg-3 col-md-6">
                            <div className="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
                                <div className="text-fresh fs-2 mb-2"><i className="fa-solid fa-location-dot"></i></div>
                                <h5 className="fw-bold mb-1">Our Location</h5>
                                <p className="text-muted small mb-2">Central Community Hub</p>
                                <span className="text-dark fw-semibold">Karachi, Pakistan</span>
                            </div>
                        </div>

                        {/* Contact Hours */}
                        <div className="col-lg-3 col-md-6">
                            <div className="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
                                <div className="text-fresh fs-2 mb-2"><i className="fa-regular fa-clock"></i></div>
                                <h5 className="fw-bold mb-1">Operating Hours</h5>
                                <p className="text-muted small mb-2">Support & guidance</p>
                                <span className="text-dark fw-semibold">Mon – Sat: 8:00 AM – 6:00 PM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form & Interactive Map */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="row gy-5">
                        {/* Form */}
                        <div className="col-lg-6">
                            <span className="badge-pill-fresh mb-2 d-inline-block">SEND A MESSAGE</span>
                            <h2 className="font-playfair text-fresh mb-3">We'd Love to Hear From You</h2>
                            <p className="text-muted mb-4">
                                Send your questions or feedback and our team will get back to you promptly.
                            </p>

                            <form onSubmit={handleSubmit} id="contactUsForm">
                                <div className="mb-3">
                                    <label htmlFor="contactName" className="form-label-fresh">Your Full Name</label>
                                    <input
                                        type="text"
                                        id="contactName"
                                        className="form-control form-control-fresh"
                                        placeholder="e.g. Zainab Khan"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="contactEmail" className="form-label-fresh">Email Address</label>
                                    <input
                                        type="email"
                                        id="contactEmail"
                                        className="form-control form-control-fresh"
                                        placeholder="e.g. you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="contactSubject" className="form-label-fresh">Subject</label>
                                    <input
                                        type="text"
                                        id="contactSubject"
                                        className="form-control form-control-fresh"
                                        placeholder="e.g. Suggest a new local market"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="contactMessage" className="form-label-fresh">Message</label>
                                    <textarea
                                        id="contactMessage"
                                        rows="5"
                                        className="form-control form-control-fresh"
                                        style={{ height: 'auto' }}
                                        placeholder="Write your message here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-fresh btn-lg w-100">
                                    <i className="fa-solid fa-paper-plane me-2"></i> Send Message
                                </button>
                            </form>
                        </div>

                        {/* Map & Location Detection */}
                        <div className="col-lg-6">
                            <span className="badge-pill-fresh mb-2 d-inline-block">LOCATION & DIRECTIONS</span>
                            <h2 className="font-playfair text-fresh mb-3">Our Community Hub</h2>
                            <p className="text-muted mb-3">
                                View our community hub on the map or click below to detect your current location.
                            </p>

                            {/* Geolocation Helper Button */}
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <button
                                    type="button"
                                    className={`btn btn-outline-fresh btn-sm ${geoStatus === 'granted' ? 'active' : ''}`}
                                    id="btnDetectLocation"
                                    onClick={() => requestUserLocation()}
                                    disabled={geoStatus === 'detecting'}
                                >
                                    <i className="fa-solid fa-location-crosshairs me-1"></i>{' '}
                                    {geoStatus === 'detecting' ? 'Detecting Location...' : geoStatus === 'granted' ? 'Location Active' : 'Detect My Location'}
                                </button>
                                <small id="contactGeoStatus" className="text-muted">
                                    {geoStatus === 'granted' && 'GPS location detected!'}
                                </small>
                            </div>

                            {/* Interactive Leaflet Map */}
                            <MarketMap
                                latitude={mapLat}
                                longitude={mapLng}
                                title={mapTitle}
                                address={mapAddress}
                                height="380px"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
