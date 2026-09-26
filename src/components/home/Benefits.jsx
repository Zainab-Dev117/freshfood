import React from 'react';

export default function Benefits() {
    return (
        <section className="benefits-section py-5" id="why-freshfind">
            <div className="container">
                <div className="text-center max-w-700 mx-auto mb-5">
                    <span className="badge-pill-fresh mb-2 d-inline-block">THE FRESHFIND DIFFERENCE</span>
                    <h2 className="font-playfair text-fresh mb-2">Why Choose FreshFind</h2>
                    <p className="text-muted">Designed to bring authentic farmers market culture into the modern digital age.</p>
                </div>

                <div className="row g-4">
                    {/* Benefit 1 */}
                    <div className="col-lg-4 col-md-6">
                        <div className="benefit-card-clean">
                            <div className="benefit-icon-wrapper">
                                <i className="fa-solid fa-store"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Local Markets</h5>
                                <p className="text-muted small mb-0">
                                    Discover verified farmers markets and community bazaars right across your city.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Benefit 2 */}
                    <div className="col-lg-4 col-md-6">
                        <div className="benefit-card-clean">
                            <div className="benefit-icon-wrapper">
                                <i className="fa-solid fa-leaf"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Seasonal Produce</h5>
                                <p className="text-muted small mb-0">
                                    Learn what's naturally in season right now for peak taste, nutrition, and environmental care.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Benefit 3 */}
                    <div className="col-lg-4 col-md-6">
                        <div className="benefit-card-clean">
                            <div className="benefit-icon-wrapper">
                                <i className="fa-solid fa-bolt"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Easy Discovery</h5>
                                <p className="text-muted small mb-0">
                                    Instant multi-filter search lets you combine area, day, and product preferences effortlessly.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Benefit 4 */}
                    <div className="col-lg-4 col-md-6">
                        <div className="benefit-card-clean">
                            <div className="benefit-icon-wrapper">
                                <i className="fa-solid fa-location-crosshairs"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Location-Based Search</h5>
                                <p className="text-muted small mb-0">
                                    Accurate Haversine distance calculations help find the nearest market from your current spot.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Benefit 5 */}
                    <div className="col-lg-4 col-md-6">
                        <div className="benefit-card-clean">
                            <div className="benefit-icon-wrapper">
                                <i className="fa-solid fa-bookmark"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Save Favorites</h5>
                                <p className="text-muted small mb-0">
                                    Keep saved bookmarks in local storage with personal shopping notes and instant export options.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Benefit 6 */}
                    <div className="col-lg-4 col-md-6">
                        <div className="benefit-card-clean">
                            <div className="benefit-icon-wrapper">
                                <i className="fa-regular fa-clock"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Fresh Information</h5>
                                <p className="text-muted small mb-0">
                                    Always up-to-date operating hours, verified location coordinates, and direct contact details.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
