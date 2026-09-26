import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function ProduceCard({ product, showMarketCount = false }) {
    const { isBookmarked, toggleBookmark, showToast } = useApp();
    const saved = isBookmarked('produce', product.id);
    const marketCount = product.markets ? product.markets.length : 1;

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggleBookmark('produce', product.id);
        showToast(added ? 'Produce saved to bookmarks!' : 'Produce removed from bookmarks.', added ? 'success' : 'info');
    };

    return (
        <div className="produce-display-card h-100">
            <div className="produce-img-box">
                <img src={product.image} alt={product.name} loading="lazy" />
                <span className="produce-category-badge">{product.category}</span>
                <button
                    className={`btn-bookmark-heart ${saved ? 'active' : ''}`}
                    onClick={handleBookmark}
                    aria-label={`Bookmark ${product.name}`}
                    title="Bookmark"
                    type="button"
                >
                    <i className={`${saved ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                </button>
            </div>
            <div className="produce-body-box d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <h4 className="produce-name mb-0">{product.name}</h4>
                    <span className="season-pill-mini">
                        <i className="fa-regular fa-calendar me-1"></i> {product.season}
                    </span>
                </div>
                <p className="produce-summary line-clamp-2 mt-2">{product.description}</p>
                {showMarketCount && (
                    <p className="available-markets-indicator">
                        <i className="fa-solid fa-store me-1 text-fresh"></i> Available at{' '}
                        <strong>{marketCount}</strong> local market{marketCount === 1 ? '' : 's'}
                    </p>
                )}
                <div className="mt-auto pt-2 border-top">
                    <Link to={`/produce/${product.id}`} className="btn btn-outline-fresh btn-sm w-100">
                        View Produce Guide <i className="fa-solid fa-arrow-right ms-1"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
}
