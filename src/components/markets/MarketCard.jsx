import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { isMarketOpen, calculateDistance } from '../../utils/engine';

export default function MarketCard({ market, userCoords = null, variant = 'directory' }) {
    const { isBookmarked, toggleBookmark, showToast, openShareModal } = useApp();
    const saved = isBookmarked('market', market.id);
    const status = isMarketOpen(market);

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
            `Discover ${market.name} in ${market.area} on FreshFind!`,
            `${window.location.origin}/markets/${market.id}`
        );
    };

    if (variant === 'home') {
        return (
            <div className="market-display-card h-100">
                <div className="card-img-wrapper">
                    <img src={market.image} alt={market.name} loading="lazy" />
                    <span className={`market-status-badge ${status.badgeClass}`}>
                        <i className={`${status.iconClass} me-1`}></i> {status.label}
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
                <div className="card-body-content">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h4 className="market-title">{market.name}</h4>
                    </div>
                    <p className="market-meta text-muted">
                        <i className="fa-solid fa-location-dot me-1 text-fresh"></i> {market.area}
                        {market.neighborhood ? ` • ${market.neighborhood}` : ''}
                    </p>
                    <p className="market-schedule">
                        <i className="fa-regular fa-calendar-check me-1 text-fresh"></i>{' '}
                        {Array.isArray(market.days) ? market.days.join(', ') : market.days}
                    </p>
                    <p className="market-hours">
                        <i className="fa-regular fa-clock me-1 text-fresh"></i> {market.hours}
                    </p>
                    {distanceText && (
                        <span className="market-distance-pill">
                            <i className="fa-solid fa-location-arrow me-1"></i> {distanceText}
                        </span>
                    )}
                    <p className="market-summary line-clamp-2 mt-2">{market.description}</p>
                    <div className="market-action-row mt-auto pt-3 border-top">
                        <Link to={`/markets/${market.id}`} className="btn btn-fresh btn-sm w-100">
                            View Details <i className="fa-solid fa-arrow-right ms-1"></i>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="directory-market-card h-100">
            <div className="card-img-container">
                <img src={market.image} alt={market.name} loading="lazy" />
                <span className={`market-status-badge ${status.badgeClass}`}>
                    <i className={`${status.iconClass} me-1`}></i> {status.label}
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
            <div className="card-details-container">
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <h3 className="directory-card-title">{market.name}</h3>
                </div>
                <p className="directory-location-meta">
                    <i className="fa-solid fa-location-dot text-fresh me-1"></i> {market.area}
                    {market.neighborhood ? ` • ${market.neighborhood}` : ''}
                </p>
                <p className="directory-schedule-line">
                    <i className="fa-regular fa-calendar-check text-fresh me-1"></i>{' '}
                    {Array.isArray(market.days) ? market.days.join(' • ') : market.days}
                </p>
                <p className="directory-hours-line">
                    <i className="fa-regular fa-clock text-fresh me-1"></i> {market.hours}
                </p>
                {distanceText && (
                    <div className="market-distance-badge">
                        <i className="fa-solid fa-location-arrow me-1"></i> {distanceText}
                    </div>
                )}
                <p className="directory-desc-snippet line-clamp-2 mt-2">{market.description}</p>

                <div className="produce-pills-row my-2">
                    {(market.products || []).slice(0, 3).map((p, idx) => (
                        <span key={idx} className="badge-produce-mini me-1">
                            {p}
                        </span>
                    ))}
                </div>

                <div className="card-actions-bottom mt-auto pt-3 border-top d-flex gap-2">
                    <Link to={`/markets/${market.id}`} className="btn btn-fresh flex-grow-1">
                        View Details <i className="fa-solid fa-arrow-right ms-1"></i>
                    </Link>
                    <button
                        className="btn btn-outline-fresh btn-share-sm"
                        onClick={handleShare}
                        title="Share market"
                        type="button"
                    >
                        <i className="fa-solid fa-share-nodes"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
