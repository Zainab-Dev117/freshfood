import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import MarketCard from '../markets/MarketCard';

export default function QuickFind() {
    const { markets, products, userCoords } = useApp();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedProduce, setSelectedProduce] = useState('');

    // Distinct areas
    const areas = useMemo(() => {
        return [...new Set(markets.map(m => m.area))].filter(Boolean).sort();
    }, [markets]);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Distinct produce names
    const produceList = useMemo(() => {
        return [...new Set(products.map(p => p.name))].filter(Boolean).sort();
    }, [products]);

    // Filter markets
    const filteredMarkets = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return markets.filter(m => {
            const matchesQuery = !q ||
                m.name.toLowerCase().includes(q) ||
                m.area.toLowerCase().includes(q) ||
                (m.neighborhood && m.neighborhood.toLowerCase().includes(q)) ||
                m.description.toLowerCase().includes(q) ||
                (m.products && m.products.some(p => p.toLowerCase().includes(q)));

            const matchesArea = !selectedArea || m.area === selectedArea;
            const matchesDay = !selectedDay || (m.days && m.days.includes(selectedDay));
            const matchesProduce = !selectedProduce || (m.products && m.products.includes(selectedProduce));

            return matchesQuery && matchesArea && matchesDay && matchesProduce;
        });
    }, [markets, searchQuery, selectedArea, selectedDay, selectedProduce]);

    const handleClear = () => {
        setSearchQuery('');
        setSelectedArea('');
        setSelectedDay('');
        setSelectedProduce('');
    };

    return (
        <section className="quick-find-section py-5" id="find-market">
            <div className="container">
                <div className="quick-find-box">
                    <div className="quick-find-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <span className="badge-pill-fresh mb-2 d-inline-block">QUICK SEARCH SYSTEM</span>
                            <h2 className="font-playfair text-fresh mb-1">Find a Market Near You</h2>
                            <p className="text-muted mb-0">
                                Search by name, neighborhood, day of the week, or the produce you desire.
                            </p>
                        </div>
                        <div>
                            <span className="badge bg-light text-dark border p-2 px-3 fw-semibold" id="quickResultsCount">
                                {filteredMarkets.length} market{filteredMarkets.length === 1 ? '' : 's'} found
                            </span>
                        </div>
                    </div>

                    {/* Search Controls */}
                    <form className="row g-3 align-items-end mt-2" onSubmit={(e) => e.preventDefault()}>
                        {/* Search Input */}
                        <div className="col-lg-3 col-md-6">
                            <label htmlFor="quickSearchInput" className="form-label-fresh">
                                <i className="fa-solid fa-magnifying-glass text-fresh"></i> Search Market
                            </label>
                            <input
                                type="text"
                                id="quickSearchInput"
                                className="form-control form-control-fresh"
                                placeholder="Market name or produce..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Area Filter */}
                        <div className="col-lg-3 col-md-6">
                            <label htmlFor="quickArea" className="form-label-fresh">
                                <i className="fa-solid fa-location-dot text-fresh"></i> Area
                            </label>
                            <select
                                id="quickArea"
                                className="form-select form-select-fresh"
                                value={selectedArea}
                                onChange={(e) => setSelectedArea(e.target.value)}
                            >
                                <option value="">All Areas</option>
                                {areas.map(area => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                        </div>

                        {/* Day Filter */}
                        <div className="col-lg-2 col-md-6">
                            <label htmlFor="quickDay" className="form-label-fresh">
                                <i className="fa-regular fa-calendar text-fresh"></i> Operating Day
                            </label>
                            <select
                                id="quickDay"
                                className="form-select form-select-fresh"
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                            >
                                <option value="">All Days</option>
                                {days.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        {/* Produce Filter */}
                        <div className="col-lg-2 col-md-6">
                            <label htmlFor="quickProduce" className="form-label-fresh">
                                <i className="fa-solid fa-carrot text-fresh"></i> Produce
                            </label>
                            <select
                                id="quickProduce"
                                className="form-select form-select-fresh"
                                value={selectedProduce}
                                onChange={(e) => setSelectedProduce(e.target.value)}
                            >
                                <option value="">All Produce</option>
                                {produceList.map(prod => (
                                    <option key={prod} value={prod}>{prod}</option>
                                ))}
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="col-lg-2 col-md-12 d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
                                id="btnClearQuickFilters"
                                title="Clear Filters"
                                onClick={handleClear}
                            >
                                <i className="fa-solid fa-rotate-left me-1"></i> Reset
                            </button>
                        </div>
                    </form>

                    {/* Live Results Grid */}
                    <div className="quick-results-area mt-4 pt-3 border-top">
                        {filteredMarkets.length === 0 ? (
                            <div className="col-12">
                                <div className="empty-state-card text-center p-5">
                                    <div className="empty-icon mb-3"><i className="fa-solid fa-store-slash"></i></div>
                                    <h4 className="font-playfair">No Markets Found</h4>
                                    <p className="text-muted">
                                        No markets match your current filter combination. Try clearing filters to see all available markets.
                                    </p>
                                    <button
                                        type="button"
                                        className="btn btn-fresh mt-2"
                                        onClick={handleClear}
                                    >
                                        <i className="fa-solid fa-rotate-left me-1"></i> Reset Filters
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="row g-4" id="quickSearchResults">
                                {filteredMarkets.slice(0, 4).map(m => (
                                    <div key={m.id} className="col-lg-3 col-md-6">
                                        <MarketCard market={m} userCoords={userCoords} variant="home" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
