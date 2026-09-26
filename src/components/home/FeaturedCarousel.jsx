import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { isMarketOpen, calculateDistance } from '../../utils/engine';

function CarouselSlide({ market, isActive, userCoords }) {
    const { isBookmarked, toggleBookmark, showToast, openShareModal } = useApp();
    const status = isMarketOpen(market);
    const saved = isBookmarked('market', market.id);

    let distanceText = null;
    if (userCoords && market.latitude && market.longitude) {
        const dist = calculateDistance(userCoords.lat, userCoords.lng, market.latitude, market.longitude);
        if (dist !== null) {
            distanceText = `${dist} km away`;
        }
    }

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggleBookmark('market', market.id);
        showToast(added ? 'Market bookmarked!' : 'Market removed from bookmarks.', added ? 'success' : 'info');
    };

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openShareModal(
            market.name,
            `Explore ${market.name} in ${market.area} on FreshFind!`,
            `${window.location.origin}/markets/${market.id}`
        );
    };

    return (
        <div
            className={`carousel-slide ${isActive ? 'active' : ''}`}
            style={{ display: isActive ? 'block' : 'none' }}
        >
            <div className="carousel-card-inner">
                <div className="slide-image-col">
                    <img src={market.image} alt={market.name} loading="lazy" />
                    <span className={`slide-status-badge ${status.badgeClass}`}>
                        <i className={`${status.iconClass} me-1`}></i> {status.label}
                    </span>
                </div>
                <div className="slide-content-col">
                    <div className="slide-badge-row d-flex justify-content-between align-items-center">
                        <span className="badge-featured-tag">
                            <i className="fa-solid fa-star me-1"></i> Featured Market
                        </span>
                        <button
                            className={`btn-bookmark-heart ${saved ? 'active' : ''}`}
                            onClick={handleBookmark}
                            aria-label={`Bookmark ${market.name}`}
                            title="Bookmark"
                            type="button"
                        >
                            <i className={`${saved ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                        </button>
                    </div>
                    <h3 className="slide-market-title font-playfair">{market.name}</h3>
                    <p className="slide-location-text">
                        <i className="fa-solid fa-location-dot text-fresh me-1"></i> {market.area}
                        {market.neighborhood ? ` (${market.neighborhood})` : ''}
                    </p>
                    <p className="slide-schedule-text">
                        <i className="fa-regular fa-calendar-days text-fresh me-1"></i>{' '}
                        {Array.isArray(market.days) ? market.days.join(' • ') : market.days}
                    </p>
                    <p className="slide-time-text">
                        <i className="fa-regular fa-clock text-fresh me-1"></i> {market.hours}
                    </p>
                    {distanceText && (
                        <span className="slide-distance-pill">
                            <i className="fa-solid fa-location-arrow me-1"></i> {distanceText}
                        </span>
                    )}
                    <p className="slide-desc-text mt-2">{market.description}</p>
                    <div className="slide-actions-row mt-3 d-flex gap-2">
                        <Link to={`/markets/${market.id}`} className="btn btn-fresh">
                            <i className="fa-solid fa-store me-1"></i> View Details
                        </Link>
                        <button
                            className="btn btn-outline-fresh btn-share-trigger"
                            onClick={handleShare}
                            type="button"
                        >
                            <i className="fa-solid fa-share-nodes me-1"></i> Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FeaturedCarousel() {
    const { markets, userCoords } = useApp();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const featured = markets.slice(0, 6);
    const count = featured.length;

    useEffect(() => {
        if (count === 0 || isPaused) return;

        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % count);
        }, 4500);

        return () => clearInterval(timer);
    }, [count, isPaused]);

    const prevSlide = () => {
        setCurrentSlide(prev => (prev - 1 + count) % count);
    };

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % count);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    };

    if (count === 0) return null;

    return (
        <section className="featured-carousel-section py-5 bg-white border-top border-bottom" id="featured-markets">
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
                    <div>
                        <span className="badge-pill-fresh mb-2 d-inline-block">CURATED SHOWCASE</span>
                        <h2 className="font-playfair text-fresh mb-1">Featured Markets</h2>
                        <p className="text-muted mb-0">Popular community markets, highly loved by neighborhood locals.</p>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
                        <Link to="/markets" className="text-fresh fw-bold text-decoration-none">
                            View Complete Directory <i className="fa-solid fa-arrow-right ms-1"></i>
                        </Link>
                        {/* Carousel Controls */}
                        <div className="carousel-nav-arrows">
                            <button
                                type="button"
                                className="carousel-arrow-btn"
                                id="carouselPrevBtn"
                                aria-label="Previous Slide"
                                onClick={prevSlide}
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>
                            <button
                                type="button"
                                className="carousel-arrow-btn"
                                id="carouselNextBtn"
                                aria-label="Next Slide"
                                onClick={nextSlide}
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Carousel Container */}
                <div
                    className="featured-carousel-wrapper"
                    id="featuredCarouselContainer"
                    tabIndex="0"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onKeyDown={handleKeyDown}
                >
                    <div className="carousel-slide-track" id="featuredCarouselTrack">
                        {featured.map((m, idx) => (
                            <CarouselSlide
                                key={m.id}
                                market={m}
                                isActive={idx === currentSlide}
                                userCoords={userCoords}
                            />
                        ))}
                    </div>

                    {/* Indicators (Dots) */}
                    <div className="carousel-dots-row" id="carouselDots">
                        {featured.map((_, idx) => (
                            <button
                                key={idx}
                                className={`carousel-dot ${idx === currentSlide ? 'active' : ''}`}
                                aria-label={`Slide ${idx + 1}`}
                                onClick={() => setCurrentSlide(idx)}
                                type="button"
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
