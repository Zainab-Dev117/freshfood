import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Breadcrumb from '../components/common/Breadcrumb';
import { isMarketOpen } from '../utils/engine';

export default function ProduceDetail() {
    const { id } = useParams();
    const {
        products,
        markets,
        isBookmarked,
        toggleBookmark,
        showToast,
        openShareModal,
        openNoteModal
    } = useApp();

    const productId = parseInt(id, 10);
    const product = products.find(p => p.id === productId) || products[0];

    const saved = product ? isBookmarked('produce', product.id) : false;

    useEffect(() => {
        if (product) {
            document.title = `${product.name} — FreshFind Produce Guide`;
            window.scrollTo(0, 0);
        }
    }, [product]);

    if (!product) {
        return (
            <div className="container py-5 text-center">
                <h2>Produce not found</h2>
                <Link to="/produce" className="btn btn-fresh mt-3">Back to Produce Guide</Link>
            </div>
        );
    }

    const handleBookmark = () => {
        const added = toggleBookmark('produce', product.id);
        showToast(added ? 'Produce saved to bookmarks!' : 'Produce removed from bookmarks.', added ? 'success' : 'info');
    };

    const handleShare = () => {
        openShareModal(
            product.name,
            `Discover fresh ${product.name} in the FreshFind Produce Guide!`,
            window.location.href
        );
    };

    const handleAddNote = () => {
        openNoteModal(`produce_${product.id}`, product.name);
    };

    // Markets carrying this produce
    const carryingMarkets = markets.filter(m => (product.markets || []).includes(m.id));

    return (
        <main>
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Produce Guide', path: '/produce' },
                    { label: product.name, active: true }
                ]}
            />

            {/* Produce Detail Showcase */}
            <section className="py-5 bg-white border-bottom">
                <div className="container">
                    <div className="row gy-4 align-items-center">
                        {/* Large Image Box */}
                        <div className="col-lg-5">
                            <div
                                className="card border-0 bg-light p-4 rounded-4 shadow-sm text-center d-flex align-items-center justify-content-center"
                                style={{ minHeight: '380px' }}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="img-fluid"
                                    style={{ maxHeight: '280px', objectFit: 'contain' }}
                                />
                            </div>
                        </div>

                        {/* Produce Content & Meta */}
                        <div className="col-lg-7">
                            <div className="ps-lg-4">
                                <span className="badge-pill-fresh mb-2 d-inline-block">
                                    {product.category}
                                </span>
                                <h1 className="font-playfair text-fresh display-6 fw-bold mb-2">
                                    {product.name}
                                </h1>

                                <div className="d-flex align-items-center gap-3 my-3">
                                    <span className="badge bg-warning-subtle text-warning-emphasis border p-2 px-3 rounded-pill fw-semibold">
                                        <i className="fa-regular fa-calendar-check me-1"></i> Peak Season: {product.season}
                                    </span>
                                </div>

                                <h5 className="fw-bold mt-4 mb-2">Description & Culinary Use</h5>
                                <p className="text-muted lead fs-6 mb-4">
                                    {product.description}
                                </p>

                                {/* Action Buttons */}
                                <div className="d-flex flex-wrap gap-2 pt-2 border-top">
                                    <button
                                        type="button"
                                        className={`btn ${saved ? 'btn-danger' : 'btn-outline-danger'}`}
                                        onClick={handleBookmark}
                                    >
                                        <i className={`${saved ? 'fa-solid' : 'fa-regular'} fa-heart me-1`}></i>{' '}
                                        {saved ? 'Bookmarked' : 'Bookmark Produce'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-fresh"
                                        onClick={handleShare}
                                    >
                                        <i className="fa-solid fa-share-nodes me-1"></i> Share Produce
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

            {/* Available Markets Section */}
            <section className="py-5 bg-light" id="available-markets">
                <div className="container">
                    <div className="mb-4">
                        <span className="badge-pill-fresh mb-2 d-inline-block">WHERE TO BUY</span>
                        <h2 className="font-playfair text-fresh mb-1">Available at These Local Markets</h2>
                        <p className="text-muted mb-0">Visit any of the verified markets below to purchase this fresh produce item.</p>
                    </div>

                    {carryingMarkets.length === 0 ? (
                        <div className="card p-4 border-0 text-muted">
                            Currently updating market inventory listings for this item.
                        </div>
                    ) : (
                        <div className="row g-4" id="produceAvailableMarketsGrid">
                            {carryingMarkets.map(m => {
                                const status = isMarketOpen(m);
                                return (
                                    <div key={m.id} className="col-lg-4 col-md-6">
                                        <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 p-3 bg-white">
                                            <div className="d-flex gap-3 align-items-center mb-2">
                                                <img
                                                    src={m.image}
                                                    alt={m.name}
                                                    className="rounded-3"
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                />
                                                <div>
                                                    <h5 className="fw-bold mb-0 text-fresh">{m.name}</h5>
                                                    <small className="text-muted">
                                                        <i className="fa-solid fa-location-dot me-1 text-fresh"></i> {m.area}
                                                    </small>
                                                </div>
                                            </div>
                                            <p className="small text-muted mb-2">
                                                <i className="fa-regular fa-calendar-check me-1"></i>{' '}
                                                {Array.isArray(m.days) ? m.days.join(', ') : m.days} • {m.hours}
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                                                <span className={`market-status-badge ${status.badgeClass} fs-8`}>
                                                    <i className={`${status.iconClass} me-1`}></i> {status.label}
                                                </span>
                                                <Link to={`/markets/${m.id}`} className="btn btn-outline-fresh btn-sm">
                                                    View Market <i className="fa-solid fa-arrow-right ms-1"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
