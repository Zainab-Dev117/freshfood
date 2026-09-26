import React from 'react';
import { Link } from 'react-router-dom';

export default function HomeCTA() {
    return (
        <section className="home-cta-section py-5">
            <div className="container text-center py-4">
                <div className="max-w-700 mx-auto">
                    <span className="badge-pill-fresh mb-2 d-inline-block">START TODAY</span>
                    <h2 className="font-playfair text-fresh mb-3 fs-1">Ready to Find Something Fresh?</h2>
                    <p className="text-muted lead mb-4">
                        Explore nearby farmers markets in your community today and enjoy naturally flavorful, fresh local harvests all year round.
                    </p>
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Link to="/markets" className="btn btn-fresh btn-lg shadow-sm">
                            <i className="fa-solid fa-store me-2"></i> Find a Market
                        </Link>
                        <Link to="/produce" className="btn btn-outline-fresh btn-lg">
                            <i className="fa-solid fa-carrot me-2"></i> Explore Produce
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
