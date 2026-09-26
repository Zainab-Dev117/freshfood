import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Breadcrumb from '../components/common/Breadcrumb';
import { isMarketOpen } from '../utils/engine';
import { exportBookmarksFile } from '../utils/exportUtils';

export default function Bookmarks() {
    const {
        markets,
        products,
        bookmarks,
        notes,
        toggleBookmark,
        showToast,
        openShareModal,
        openNoteModal
    } = useApp();

    useEffect(() => {
        document.title = 'My Bookmarks — FreshFind';
        window.scrollTo(0, 0);
    }, []);

    const savedMarkets = markets.filter(m => bookmarks.markets.includes(m.id));
    const savedProduce = products.filter(p => bookmarks.produce.includes(p.id));
    const totalCount = savedMarkets.length + savedProduce.length;

    const handleExportTxt = () => {
        exportBookmarksFile(savedMarkets, savedProduce, 'txt', notes);
        showToast('Bookmarks exported as text file!', 'success');
    };

    const handleExportJson = () => {
        exportBookmarksFile(savedMarkets, savedProduce, 'json', notes);
        showToast('Bookmarks exported as JSON file!', 'success');
    };

    const handleRemoveMarket = (id) => {
        toggleBookmark('market', id);
        showToast('Market removed from bookmarks.', 'info');
    };

    const handleRemoveProduce = (id) => {
        toggleBookmark('produce', id);
        showToast('Produce removed from bookmarks.', 'info');
    };

    return (
        <main>
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: 'Bookmarks', active: true }]} />

            {/* Bookmarks Page Header & Export System */}
            <section className="py-5 bg-white border-bottom">
                <div className="container">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <span className="badge-pill-fresh mb-2 d-inline-block">SAVED RECOMMENDATIONS</span>
                            <h1 className="font-playfair text-fresh mb-2 display-6 fw-bold">
                                My Bookmarks{' '}
                                <span className="badge bg-danger rounded-pill fs-6 align-middle ms-2" id="totalBookmarksCountBadge">
                                    {totalCount}
                                </span>
                            </h1>
                            <p className="text-muted lead fs-6 mb-0">
                                Review your saved favorite markets, produce items, and personal visit notes.
                            </p>
                        </div>

                        {/* Export Controls */}
                        <div className="d-flex align-items-center gap-2">
                            <button
                                type="button"
                                className="btn btn-fresh"
                                id="btnExportBookmarksTxt"
                                onClick={handleExportTxt}
                            >
                                <i className="fa-solid fa-file-arrow-down me-1"></i> Export Bookmarks (.TXT)
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-fresh"
                                id="btnExportBookmarksJson"
                                title="Export as JSON"
                                onClick={handleExportJson}
                            >
                                <i className="fa-solid fa-code me-1"></i> JSON
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Bookmarks Content */}
            <section className="py-5 bg-light">
                <div className="container">
                    {/* Saved Markets Section */}
                    <div className="mb-5">
                        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                            <h3 className="font-playfair text-fresh mb-0">
                                <i className="fa-solid fa-store me-2 text-fresh"></i> Saved Markets
                                <span className="badge bg-secondary-subtle text-secondary rounded-pill fs-6 ms-2" id="savedMarketsCountBadge">
                                    {savedMarkets.length}
                                </span>
                            </h3>
                            <Link to="/markets" className="text-fresh small fw-semibold text-decoration-none">
                                + Find more markets
                            </Link>
                        </div>

                        {savedMarkets.length === 0 ? (
                            <div className="col-12">
                                <div className="empty-state-card text-center p-4">
                                    <div className="empty-icon mb-2"><i className="fa-regular fa-heart"></i></div>
                                    <h5 className="font-playfair">No Markets Saved Yet</h5>
                                    <p className="text-muted">
                                        Click the heart icon (♡) on any market card to save it here for easy reference.
                                    </p>
                                    <Link to="/markets" className="btn btn-fresh btn-sm">
                                        <i className="fa-solid fa-store me-1"></i> Browse Market Directory
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="row g-4" id="savedMarketsContainer">
                                {savedMarkets.map(m => {
                                    const status = isMarketOpen(m);
                                    const noteKey = `market_${m.id}`;
                                    const noteText = notes[noteKey] || '';

                                    return (
                                        <div key={m.id} className="col-lg-6 col-md-12">
                                            <div className="bookmark-item-card h-100">
                                                <div className="bookmark-card-top d-flex gap-3">
                                                    <div className="bookmark-img-thumb">
                                                        <img src={m.image} alt={m.name} />
                                                    </div>
                                                    <div className="bookmark-meta-content flex-grow-1">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <h4 className="bookmark-title mb-1">{m.name}</h4>
                                                            <button
                                                                className="btn-remove-bookmark"
                                                                onClick={() => handleRemoveMarket(m.id)}
                                                                title="Remove Bookmark"
                                                                type="button"
                                                            >
                                                                <i className="fa-solid fa-trash-can"></i>
                                                            </button>
                                                        </div>
                                                        <p className="text-muted mb-1">
                                                            <i className="fa-solid fa-location-dot text-fresh me-1"></i>{' '}
                                                            {m.area}{m.neighborhood ? ` (${m.neighborhood})` : ''}
                                                        </p>
                                                        <p className="text-muted mb-1">
                                                            <i className="fa-regular fa-clock text-fresh me-1"></i> {m.hours}
                                                        </p>
                                                        <span className={`market-status-badge ${status.badgeClass} mb-2`}>
                                                            <i className={`${status.iconClass} me-1`}></i> {status.label}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Session Note Section */}
                                                <div className="session-note-box mt-3 p-3 bg-light rounded">
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <span className="note-label">
                                                            <i className="fa-solid fa-note-sticky text-warning me-1"></i> Session Note:
                                                        </span>
                                                        <button
                                                            className="btn-edit-note btn-link-action"
                                                            onClick={() => openNoteModal(noteKey, m.name)}
                                                            type="button"
                                                        >
                                                            <i className={`fa-solid ${noteText ? 'fa-pen' : 'fa-plus'} me-1`}></i>{' '}
                                                            {noteText ? 'Edit' : 'Add Note'}
                                                        </button>
                                                    </div>
                                                    <p className={`note-text mb-0 ${noteText ? '' : 'text-muted fst-italic'}`}>
                                                        {noteText ? `"${noteText}"` : 'No personal note added yet. Click "Add Note" to set a visit reminder.'}
                                                    </p>
                                                </div>

                                                <div className="bookmark-card-actions mt-3 pt-2 border-top d-flex gap-2">
                                                    <Link to={`/markets/${m.id}`} className="btn btn-fresh btn-sm flex-grow-1">
                                                        View Market <i className="fa-solid fa-arrow-right ms-1"></i>
                                                    </Link>
                                                    <button
                                                        className="btn btn-outline-fresh btn-sm"
                                                        onClick={() => openShareModal(m.name, `Saved market in ${m.area}`, `${window.location.origin}/markets/${m.id}`)}
                                                        title="Share"
                                                        type="button"
                                                    >
                                                        <i className="fa-solid fa-share-nodes"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Saved Produce Section */}
                    <div className="mb-4">
                        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                            <h3 className="font-playfair text-fresh mb-0">
                                <i className="fa-solid fa-apple-whole me-2 text-fresh"></i> Saved Produce
                                <span className="badge bg-secondary-subtle text-secondary rounded-pill fs-6 ms-2" id="savedProduceCountBadge">
                                    {savedProduce.length}
                                </span>
                            </h3>
                            <Link to="/produce" className="text-fresh small fw-semibold text-decoration-none">
                                + Explore produce guide
                            </Link>
                        </div>

                        {savedProduce.length === 0 ? (
                            <div className="col-12">
                                <div className="empty-state-card text-center p-4">
                                    <div className="empty-icon mb-2"><i className="fa-regular fa-heart"></i></div>
                                    <h5 className="font-playfair">No Produce Items Saved Yet</h5>
                                    <p className="text-muted">
                                        Click the heart icon (♡) on any produce card to add it to your shopping bookmarks.
                                    </p>
                                    <Link to="/produce" className="btn btn-fresh btn-sm">
                                        <i className="fa-solid fa-apple-whole me-1"></i> Browse Produce Guide
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="row g-4" id="savedProduceContainer">
                                {savedProduce.map(p => {
                                    const noteKey = `produce_${p.id}`;
                                    const noteText = notes[noteKey] || '';

                                    return (
                                        <div key={p.id} className="col-lg-6 col-md-12">
                                            <div className="bookmark-item-card h-100">
                                                <div className="bookmark-card-top d-flex gap-3">
                                                    <div className="bookmark-img-thumb">
                                                        <img src={p.image} alt={p.name} />
                                                    </div>
                                                    <div className="bookmark-meta-content flex-grow-1">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <h4 className="bookmark-title mb-1">{p.name}</h4>
                                                            <button
                                                                className="btn-remove-bookmark"
                                                                onClick={() => handleRemoveProduce(p.id)}
                                                                title="Remove Bookmark"
                                                                type="button"
                                                            >
                                                                <i className="fa-solid fa-trash-can"></i>
                                                            </button>
                                                        </div>
                                                        <p className="text-muted mb-1">
                                                            <span className="badge-produce-mini me-2">{p.category}</span>
                                                            <small className="text-muted">Peak: {p.season}</small>
                                                        </p>
                                                        <p className="small text-muted line-clamp-2 mb-2">{p.description}</p>
                                                    </div>
                                                </div>

                                                {/* Session Note Section */}
                                                <div className="session-note-box mt-3 p-3 bg-light rounded">
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <span className="note-label">
                                                            <i className="fa-solid fa-note-sticky text-warning me-1"></i> Session Note:
                                                        </span>
                                                        <button
                                                            className="btn-edit-note btn-link-action"
                                                            onClick={() => openNoteModal(noteKey, p.name)}
                                                            type="button"
                                                        >
                                                            <i className={`fa-solid ${noteText ? 'fa-pen' : 'fa-plus'} me-1`}></i>{' '}
                                                            {noteText ? 'Edit' : 'Add Note'}
                                                        </button>
                                                    </div>
                                                    <p className={`note-text mb-0 ${noteText ? '' : 'text-muted fst-italic'}`}>
                                                        {noteText ? `"${noteText}"` : 'No personal note added yet. Click "Add Note" for culinary reminders.'}
                                                    </p>
                                                </div>

                                                <div className="bookmark-card-actions mt-3 pt-2 border-top d-flex gap-2">
                                                    <Link to={`/produce/${p.id}`} className="btn btn-fresh btn-sm flex-grow-1">
                                                        View Produce <i className="fa-solid fa-arrow-right ms-1"></i>
                                                    </Link>
                                                    <button
                                                        className="btn btn-outline-fresh btn-sm"
                                                        onClick={() => openShareModal(p.name, `Seasonal produce on FreshFind: ${p.name}`, `${window.location.origin}/produce/${p.id}`)}
                                                        title="Share"
                                                        type="button"
                                                    >
                                                        <i className="fa-solid fa-share-nodes"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
