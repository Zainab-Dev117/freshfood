import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
    const scrollToQuickFind = (e) => {
        e.preventDefault();
        const el = document.getElementById('find-market');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero-section-premium position-relative overflow-hidden">
            <div className="container">
                <div className="row align-items-center gy-5">
                    {/* Hero Content */}
                    <div className="col-lg-6">
                        <div className="hero-content-wrapper pe-lg-4">
                            <span className="hero-pill-badge">
                                <i className="fa-solid fa-basket-shopping me-2"></i> Local Community Harvest
                            </span>

                            <h1 className="hero-main-title">
                                Fresh Finds. <br />
                                Local Markets. <br />
                                <span className="highlight-text">Better Choices.</span>
                            </h1>

                            <p className="hero-lead-text">
                                Fresh local produce aur nearby farmers markets ko easily discover karne ka platform. Connect directly with neighborhood growers and vibrant weekend markets.
                            </p>

                            <div className="hero-cta-group d-flex flex-wrap gap-3 pt-2">
                                <a
                                    href="#find-market"
                                    onClick={scrollToQuickFind}
                                    className="btn btn-fresh btn-lg shadow-sm"
                                    id="btnHeroFindMarket"
                                >
                                    <i className="fa-solid fa-magnifying-glass-location me-2"></i> Find a Market Near You
                                </a>
                                <Link
                                    to="/produce"
                                    className="btn btn-outline-fresh btn-lg"
                                    id="btnHeroExploreProduce"
                                >
                                    <i className="fa-solid fa-apple-whole me-2"></i> Explore Produce
                                </Link>
                            </div>

                            {/* Trust / Benefit Micro Badges */}
                            <div className="d-flex align-items-center gap-4 mt-4 pt-3 border-top border-light flex-wrap">
                                <div className="d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-circle-check text-success fs-5"></i>
                                    <small className="text-muted fw-semibold">12+ Verified Markets</small>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-calendar-check text-success fs-5"></i>
                                    <small className="text-muted fw-semibold">Live Open Schedules</small>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="fa-solid fa-seedling text-success fs-5"></i>
                                    <small className="text-muted fw-semibold">100% Seasonal Guides</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image Showcase */}
                    <div className="col-lg-6">
                        <div className="hero-image-frame">
                            <img
                                src="/images/hero (2).jpeg"
                                alt="Vibrant farmers market with fresh produce"
                                id="heroMainImage"
                            />
                            {/* Floating Stat Badge */}
                            <div className="hero-floating-stat">
                                <div className="stat-icon">
                                    <i className="fa-solid fa-sun text-warning"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">Fresh Daily Picks</h6>
                                    <small className="text-muted">Direct from organic growers</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
