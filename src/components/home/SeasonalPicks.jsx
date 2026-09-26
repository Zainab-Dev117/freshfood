import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getCurrentSeason } from '../../utils/engine';
import ProduceCard from '../produce/ProduceCard';

export default function SeasonalPicks() {
    const { products, seasonalData } = useApp();
    const currentSeason = useMemo(() => getCurrentSeason(), []);
    const [selectedSeason, setSelectedSeason] = useState(currentSeason.id);

    const seasons = [
        { id: 'Spring', name: 'Spring', emoji: '🌱' },
        { id: 'Summer', name: 'Summer', emoji: '☀️' },
        { id: 'Fall', name: 'Fall / Autumn', emoji: '🍂' },
        { id: 'Winter', name: 'Winter', emoji: '❄️' }
    ];

    const seasonalDescription = seasonalData[selectedSeason]?.description ||
        'Naturally grown produce harvested at peak flavor and nutritional ripeness.';

    const displayedProducts = useMemo(() => {
        return products
            .filter(p => p.season === selectedSeason || p.season === 'Year-round')
            .slice(0, 8);
    }, [products, selectedSeason]);

    return (
        <section className="seasonal-picks-section py-5" id="seasonal-picks">
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 gap-3">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-2" id="currentSeasonBadge">
                            <span
                                className="season-badge-glow"
                                style={{ backgroundColor: currentSeason.color }}
                            >
                                {currentSeason.emoji} {currentSeason.name.toUpperCase()} SELECTION
                            </span>
                        </div>
                        <h2 className="font-playfair text-fresh mb-1">Fresh Picks This Season</h2>
                        <p className="text-muted mb-0" id="currentSeasonDesc">
                            {seasonalDescription}
                        </p>
                    </div>

                    {/* Season Selector Pills */}
                    <div className="season-pills-wrapper" id="seasonPillsList">
                        {seasons.map(s => {
                            const isCurrent = s.id === currentSeason.id;
                            const isSelected = s.id === selectedSeason;
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    className={`btn-season-pill ${isSelected ? 'active' : ''}`}
                                    onClick={() => setSelectedSeason(s.id)}
                                >
                                    {s.emoji} {s.name}{' '}
                                    {isCurrent && <span className="current-tag">NOW</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Seasonal Produce Cards Grid */}
                <div className="row g-4" id="seasonalProductsContainer">
                    {displayedProducts.map(p => (
                        <div key={p.id} className="col-lg-3 col-md-6">
                            <ProduceCard product={p} showMarketCount={true} />
                        </div>
                    ))}
                </div>

                <div className="text-center mt-4">
                    <Link to="/produce" className="btn btn-outline-fresh btn-lg">
                        <i className="fa-solid fa-book-open me-2"></i> View Complete Produce Catalogue
                    </Link>
                </div>
            </div>
        </section>
    );
}
