import React, { useState, useEffect } from 'react';

export default function VisitorCounter() {
    const [count, setCount] = useState(12458);

    useEffect(() => {
        // Slow simulation increment
        const interval = setInterval(() => {
            setCount(prev => prev + Math.floor(Math.random() * 2) + 1);
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="visitor-counter-wrapper py-4">
            <div className="container">
                <div className="visitor-counter-section">
                    <div className="row align-items-center">
                        <div className="col-lg-8 text-lg-start mb-3 mb-lg-0">
                            <div className="d-flex align-items-center gap-2 mb-1 justify-content-center justify-content-lg-start">
                                <span className="live-pulse-dot"></span>
                                <span className="text-white-50 fw-semibold text-uppercase small">Community Engagement</span>
                            </div>
                            <h3 className="font-playfair text-white mb-1">Join Thousands of Local Food Enthusiasts</h3>
                            <p className="text-white-50 mb-0">Discovering fresh farm harvests, artisanal breads, and healthy choices every week.</p>
                            {/* Explicit Requirement 9 Note */}
                            <span className="simulated-note-tag mt-2 d-inline-block">
                                *Note: Simulated live visitor counter for demonstration purposes.
                            </span>
                        </div>
                        <div className="col-lg-4 text-center text-lg-end">
                            <div className="visitor-number-display" id="visitorCounterNum">
                                {count.toLocaleString()}+
                            </div>
                            <div className="text-white fw-bold">Visitors Exploring FreshFind</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
