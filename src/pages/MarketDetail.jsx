import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Breadcrumb from '../components/common/Breadcrumb';
import ScheduleTable from '../components/markets/ScheduleTable';
import MarketMap from '../components/markets/MarketMap';
import ProduceCard from '../components/produce/ProduceCard';
import { isMarketOpen } from '../utils/engine';

export default function MarketDetail() {
    const { id } = useParams();
    const {
        markets,
        products,
        isBookmarked,
        toggleBookmark,
        showToast,
        openShareModal,
        openNoteModal
    } = useApp();

    const marketId = parseInt(id, 10);
    const market = markets.find(m => m.id === marketId) || markets[0];

    const saved = market ? isBookmarked('market', market.id) : false;
    const status = market ? isMarketOpen(market) : null;

    useEffect(() => {
        if (market) {
            document.title = `${market.name} — FreshFind Market Directory`;
            window.scrollTo(0, 0);
        }
    }, [market]);

    if (!market) {
        return (
            <div className="container py-5 text-center">
                <h2>Market not found</h2>
                <Link to="/markets" className="btn btn-fresh mt-3">Back to Directory</Link>
            </div>
        );
    }

    const handleBookmark = () => {
        const added = toggleBookmark('market', market.id);
        showToast(added ? 'Market bookmarked!' : 'Market removed from bookmarks.', added ? 'success' : 'info');
    };

    const handleShare = () => {
        openShareModal(
            market.name,
            `Discover ${market.name} in ${market.area} on FreshFind!`,
            window.location.href
        );
    };

    const handleAddNote = () => {
        openNoteModal(`market_${market.id}`, market.name);
    };

    // Filter produce available at this market
    const availableProduce = products.filter(p => (p.markets || []).includes(market.id));

    return (
        <main>
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Market Directory', path: '/markets' },
                    { label: market.name, active: true }
                ]}
            />

            {/* Market Header */}
            <section className="py-5 bg-white border-bottom">
                <div className="container">
                    <div className="row gy-4 align-items-center">
                        {/* Large Image Showcase */}
                        <div className="col-lg-6">
                            <div className="position-relative rounded-4 overflow-hidden shadow-md" style={{ height: '380px' }}>
                                <img
                                    src={market.image}
                                    alt={market.name}
                                    className="w-100 h-100 object-fit-cover"
                                />
                                {status && (
                                    <span className={`market-status-badge position-absolute top-0 start-0 m-3 ${status.badgeClass}`}>
                                        <i className={`${status.iconClass} me-1`}></i> {status.label}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Market Content & Actions */}
                        <div className="col-lg-6">
                            <div className="ps-lg-3">
                                <span className="badge-pill-fresh mb-2 d-inline-block">LOCAL FARMERS MARKET</span>
                                <h1 className="font-playfair text-fresh display-6 fw-bold mb-2">
                                    {market.name}
                                </h1>

                                <p className="fs-5 text-muted mb-2">
                                    <i className="fa-solid fa-location-dot text-fresh me-1"></i> {market.area}
                                    {market.neighborhood ? ` • ${market.neighborhood}` : ''}
                                </p>

                                {status && (
                                    <p className="text-secondary mb-3">
                                        <i className="fa-regular fa-clock me-1"></i> {status.detail}
                                    </p>
                                )}

                                <p className="lead fs-6 text-muted mb-4">
                                    {market.description}
                                </p>

                                {/* Action Buttons */}
                                <div className="d-flex flex-wrap gap-2 pt-2">
                                    <button
                                        type="button"
                                        className={`btn ${saved ? 'btn-danger' : 'btn-outline-danger'}`}
                                        onClick={handleBookmark}
                                    >
                                        <i className={`${saved ? 'fa-solid' : 'fa-regular'} fa-heart me-1`}></i>{' '}
                                        {saved ? 'Bookmarked' : 'Bookmark Market'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-fresh"
                                        onClick={handleShare}
                                    >
                                        <i className="fa-solid fa-share-nodes me-1"></i> Share Market
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={handleAddNote}
                                    >
                                        <i className="fa-solid fa-note-sticky me-1"></i> Add Session Note
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Weekly Schedule Section */}
            <section className="py-5 bg-light border-bottom" id="schedule">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <span className="badge-pill-fresh mb-2 d-inline-block">OPERATING HOURS</span>
                            <h2 className="font-playfair text-fresh mb-1">Seven-Day Weekly Schedule</h2>
                            <p className="text-muted mb-0">Check operating days and hours with current day highlighted.</p>
                        </div>
                    </div>

                    <ScheduleTable market={market} />
                </div>
            </section>

            {/* Market Location & Interactive Leaflet Map */}
            <section className="py-5 bg-white border-bottom" id="location">
                <div className="container">
                    <div className="row gy-4">
                        {/* Location Details */}
                        <div className="col-lg-5">
                            <span className="badge-pill-fresh mb-2 d-inline-block">ADDRESS & ACCESS</span>
                            <h2 className="font-playfair text-fresh mb-3">Market Location</h2>

                            <div className="card border-0 bg-light p-4 rounded-4 mb-3">
                                <div className="d-flex gap-3 align-items-start mb-3">
                                    <div className="fs-4 text-fresh mt-1"><i className="fa-solid fa-location-dot"></i></div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Full Street Address</h6>
                                        <p className="text-muted mb-0">{market.address}</p>
                                    </div>
                                </div>

                                <div className="d-flex gap-3 align-items-start mb-3">
                                    <div className="fs-4 text-fresh mt-1"><i className="fa-solid fa-map"></i></div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Area & Neighborhood</h6>
                                        <p className="text-muted mb-0">
                                            {market.area} ({market.neighborhood || 'Central Zone'})
                                        </p>
                                    </div>
                                </div>

                                <div className="d-flex gap-3 align-items-start">
                                    <div className="fs-4 text-fresh mt-1"><i className="fa-solid fa-compass"></i></div>
                                    <div>
                                        <h6 className="fw-bold mb-1">GPS Coordinates</h6>
                                        <p className="text-muted mb-0">
                                            {market.latitude ? `${market.latitude.toFixed(4)}° N, ${market.longitude.toFixed(4)}° E` : 'Coordinates verified'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-muted small">
                                <i className="fa-solid fa-circle-info text-fresh me-1"></i> Visitors are advised to bring reusable shopping bags and arrive early on peak weekend mornings.
                            </p>
                        </div>

                        {/* Interactive Map */}
                        <div className="col-lg-7">
                            <MarketMap
                                latitude={market.latitude}
                                longitude={market.longitude}
                                title={market.name}
                                address={market.address}
                                hours={market.hours}
                                height="380px"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Available Produce Section */}
            <section className="py-5 bg-light" id="available-produce">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <span className="badge-pill-fresh mb-2 d-inline-block">TYPICAL HARVEST</span>
                            <h2 className="font-playfair text-fresh mb-1">Available Produce</h2>
                            <p className="text-muted mb-0">Browse fresh fruits, vegetables, dairy, and herbs typically found at this market.</p>
                        </div>
                    </div>

                    {availableProduce.length === 0 ? (
                        <div className="col-12">
                            <p className="text-muted">Produce catalogue updating for this market.</p>
                        </div>
                    ) : (
                        <div className="row g-4" id="marketProduceGrid">
                            {availableProduce.map(prod => (
                                <div key={prod.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                                    <ProduceCard product={prod} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
