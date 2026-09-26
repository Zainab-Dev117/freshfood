import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Breadcrumb from '../components/common/Breadcrumb';
import MarketCard from '../components/markets/MarketCard';
import { calculateDistance, isMarketOpen, getDaysUntilNextOpen } from '../utils/engine';

export default function MarketDirectory() {
    const { markets, products, userCoords, geoStatus, requestUserLocation } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedProduce, setSelectedProduce] = useState('');
    const [sortBy, setSortBy] = useState('default');

    useEffect(() => {
        document.title = 'Farmers Market Directory — FreshFind';
        window.scrollTo(0, 0);

        // Read query params if present
        const dayParam = searchParams.get('day');
        const areaParam = searchParams.get('area');
        const produceParam = searchParams.get('produce');
        const filterParam = searchParams.get('filter');

        if (dayParam) setSelectedDay(dayParam);
        if (areaParam) setSelectedArea(areaParam);
        if (produceParam) setSelectedProduce(produceParam);

        if (filterParam === 'today') {
            const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            setSelectedDay(todayName);
        }
    }, [searchParams]);

    // Distinct areas
    const areas = useMemo(() => {
        return [...new Set(markets.map(m => m.area))].filter(Boolean).sort();
    }, [markets]);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Distinct produce names
    const produceList = useMemo(() => {
        return [...new Set(products.map(p => p.name))].filter(Boolean).sort();
    }, [products]);

    // Filtering & Sorting
    const processedMarkets = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();

        let filtered = markets.filter(m => {
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

        const list = [...filtered];

        if (sortBy === 'az') {
            list.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'za') {
            list.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortBy === 'nearest') {
            if (userCoords) {
                list.sort((a, b) => {
                    const distA = calculateDistance(userCoords.lat, userCoords.lng, a.latitude, a.longitude) ?? 9999;
                    const distB = calculateDistance(userCoords.lat, userCoords.lng, b.latitude, b.longitude) ?? 9999;
                    return distA - distB;
                });
            }
        } else if (sortBy === 'next-open') {
            const now = new Date();
            list.sort((a, b) => {
                const statusA = isMarketOpen(a, now);
                const statusB = isMarketOpen(b, now);

                if (statusA.isOpen && !statusB.isOpen) return -1;
                if (!statusA.isOpen && statusB.isOpen) return 1;

                const daysA = getDaysUntilNextOpen(a, now);
                const daysB = getDaysUntilNextOpen(b, now);
                return daysA - daysB;
            });
        }

        return list;
    }, [markets, searchQuery, selectedArea, selectedDay, selectedProduce, sortBy, userCoords]);

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedArea('');
        setSelectedDay('');
        setSelectedProduce('');
        setSortBy('default');
        setSearchParams({});
    };

    const handleSortChange = (e) => {
        const val = e.target.value;
        setSortBy(val);
        if (val === 'nearest' && !userCoords) {
            requestUserLocation();
        }
    };

    return (
        <main>
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: 'Market Directory', active: true }]} />

            {/* Directory Hero Banner */}
            <section className="py-5 bg-white border-bottom">
                <div className="container">
                    <div className="max-w-800">
                        <span className="badge-pill-fresh mb-2 d-inline-block">COMPLETE LISTING</span>
                        <h1 className="font-playfair text-fresh mb-2 display-6 fw-bold">Farmers Market Directory</h1>
                        <p className="text-muted lead mb-0">
                            Explore neighborhood farmers markets across the city. Find real-time operating hours, schedules, distance-based directions, and fresh produce selections.
                        </p>
                    </div>
                </div>
            </section>

            {/* Discovery & Filter Controls */}
            <section className="py-4 bg-light border-bottom">
                <div className="container">
                    <div className="card border-0 shadow-sm p-4 rounded-4">
                        <div className="row g-3 align-items-end">
                            {/* Text Search */}
                            <div className="col-lg-3 col-md-6">
                                <label htmlFor="directorySearch" className="form-label-fresh">
                                    <i className="fa-solid fa-magnifying-glass text-fresh"></i> Search
                                </label>
                                <input
                                    type="text"
                                    id="directorySearch"
                                    className="form-control form-control-fresh"
                                    placeholder="Name, area, produce..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Area Filter */}
                            <div className="col-lg-2 col-md-6">
                                <label htmlFor="directoryArea" className="form-label-fresh">
                                    <i className="fa-solid fa-location-dot text-fresh"></i> Area
                                </label>
                                <select
                                    id="directoryArea"
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
                                <label htmlFor="directoryDay" className="form-label-fresh">
                                    <i className="fa-regular fa-calendar text-fresh"></i> Day
                                </label>
                                <select
                                    id="directoryDay"
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
                                <label htmlFor="directoryProduce" className="form-label-fresh">
                                    <i className="fa-solid fa-carrot text-fresh"></i> Produce
                                </label>
                                <select
                                    id="directoryProduce"
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

                            {/* Market Sorting */}
                            <div className="col-lg-2 col-md-6">
                                <label htmlFor="directorySort" className="form-label-fresh">
                                    <i className="fa-solid fa-arrow-down-wide-short text-fresh"></i> Sort By
                                </label>
                                <select
                                    id="directorySort"
                                    className="form-select form-select-fresh"
                                    value={sortBy}
                                    onChange={handleSortChange}
                                >
                                    <option value="default">Default</option>
                                    <option value="az">A-Z (Name)</option>
                                    <option value="za">Z-A (Reverse)</option>
                                    <option value="nearest">Nearest (GPS)</option>
                                    <option value="next-open">Next Open</option>
                                </select>
                            </div>

                            {/* Reset Button */}
                            <div className="col-lg-1 col-md-12">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary w-100"
                                    id="btnClearDirectoryFilters"
                                    title="Clear All Filters"
                                    onClick={handleClearFilters}
                                >
                                    <i className="fa-solid fa-rotate-left"></i>
                                </button>
                            </div>
                        </div>

                        {/* Geolocation & Meta Bar */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center pt-3 mt-3 border-top gap-3">
                            <div className="d-flex align-items-center gap-3">
                                <button
                                    type="button"
                                    className={`btn btn-outline-fresh btn-sm ${geoStatus === 'granted' ? 'active' : ''}`}
                                    id="btnUseMyLocation"
                                    onClick={() => requestUserLocation()}
                                    disabled={geoStatus === 'detecting'}
                                >
                                    {geoStatus === 'detecting' ? (
                                        <>
                                            <i className="fa-solid fa-spinner fa-spin me-1"></i> Detecting...
                                        </>
                                    ) : geoStatus === 'granted' ? (
                                        <>
                                            <i className="fa-solid fa-location-crosshairs text-success me-1"></i> Location Active
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-location-crosshairs me-1"></i> Use My Location
                                        </>
                                    )}
                                </button>
                                <small id="geoStatusMessage" className="text-muted">
                                    {geoStatus === 'granted' && (
                                        <span className="text-success">
                                            <i className="fa-solid fa-circle-check me-1"></i> Location detected! Showing exact distances.
                                        </span>
                                    )}
                                    {geoStatus === 'denied' && (
                                        <span className="text-muted">
                                            <i className="fa-solid fa-circle-info me-1"></i> Location access optional. All markets searchable.
                                        </span>
                                    )}
                                </small>
                            </div>

                            {/* Result Count */}
                            <div className="text-muted small" id="directoryResultsCount">
                                Showing <strong>{processedMarkets.length}</strong> of <strong>{markets.length}</strong> Markets
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Market Cards Results Grid */}
            <section className="py-5">
                <div className="container">
                    {processedMarkets.length === 0 ? (
                        <div className="col-12">
                            <div className="empty-state-card text-center p-5 my-4">
                                <div className="empty-icon mb-3"><i className="fa-solid fa-store-slash"></i></div>
                                <h3 className="font-playfair">No Markets Found</h3>
                                <p className="text-muted">
                                    No markets match your selected filters. Try broadening your search or resetting filters.
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-fresh mt-2"
                                    onClick={handleClearFilters}
                                >
                                    <i className="fa-solid fa-rotate-left me-1"></i> Clear All Filters
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-4" id="marketDirectoryCards">
                            {processedMarkets.map(m => (
                                <div key={m.id} className="col-lg-4 col-md-6 mb-4">
                                    <MarketCard market={m} userCoords={userCoords} variant="directory" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
