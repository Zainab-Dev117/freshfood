import React from 'react';

export default function HowItWorks() {
    return (
        <section className="how-it-works-section py-5 bg-white border-top border-bottom" id="how-it-works">
            <div className="container">
                <div className="text-center max-w-700 mx-auto mb-5">
                    <span className="badge-pill-fresh mb-2 d-inline-block">EASY DISCOVERY FLOW</span>
                    <h2 className="font-playfair text-fresh mb-2">How FreshFind Works</h2>
                    <p className="text-muted">Connecting you to wholesome local farm harvests in four seamless steps.</p>
                </div>

                <div className="row g-4">
                    {/* Step 01 */}
                    <div className="col-lg-3 col-md-6">
                        <div className="how-it-works-card">
                            <div className="step-number-tag">01</div>
                            <div className="step-icon-circle">
                                <i className="fa-solid fa-compass"></i>
                            </div>
                            <h4 className="font-playfair mb-2">Discover</h4>
                            <p className="text-muted small mb-0">
                                Find nearby farmers markets filtered by your area, operating days, and produce desires.
                            </p>
                        </div>
                    </div>

                    {/* Step 02 */}
                    <div className="col-lg-3 col-md-6">
                        <div className="how-it-works-card">
                            <div className="step-number-tag">02</div>
                            <div className="step-icon-circle">
                                <i className="fa-regular fa-clock"></i>
                            </div>
                            <h4 className="font-playfair mb-2">Explore</h4>
                            <p className="text-muted small mb-0">
                                Check live open/closed status, full 7-day operating hours, and available fresh produce catalog.
                            </p>
                        </div>
                    </div>

                    {/* Step 03 */}
                    <div className="col-lg-3 col-md-6">
                        <div className="how-it-works-card">
                            <div className="step-number-tag">03</div>
                            <div className="step-icon-circle">
                                <i className="fa-regular fa-heart"></i>
                            </div>
                            <h4 className="font-playfair mb-2">Save</h4>
                            <p className="text-muted small mb-0">
                                Bookmark your favorite markets and produce, add custom session reminders, and export records.
                            </p>
                        </div>
                    </div>

                    {/* Step 04 */}
                    <div className="col-lg-3 col-md-6">
                        <div className="how-it-works-card">
                            <div className="step-number-tag">04</div>
                            <div className="step-icon-circle">
                                <i className="fa-solid fa-map-location-dot"></i>
                            </div>
                            <h4 className="font-playfair mb-2">Visit</h4>
                            <p className="text-muted small mb-0">
                                Use interactive Leaflet maps and precise GPS coordinates to visit markets and support local growers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
