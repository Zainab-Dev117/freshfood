import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Breadcrumb from '../components/common/Breadcrumb';
import ProduceCard from '../components/produce/ProduceCard';

export default function ProduceGuide() {
    const { products } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSeason, setSelectedSeason] = useState('all');

    useEffect(() => {
        document.title = 'Fresh Produce Guide — FreshFind';
        window.scrollTo(0, 0);

        const catParam = searchParams.get('category');
        const seasonParam = searchParams.get('season');
        const qParam = searchParams.get('q');

        if (catParam) setSelectedCategory(catParam);
        if (seasonParam) setSelectedSeason(seasonParam);
        if (qParam) setSearchQuery(qParam);
    }, [searchParams]);

    const categories = ['all', 'Fruits', 'Vegetables', 'Herbs', 'Dairy', 'Bakery', 'Other'];
    const seasonTabs = [
        { id: 'all', name: 'All Seasons', emoji: '🌟' },
        { id: 'Spring', name: 'Spring', emoji: '🌱' },
        { id: 'Summer', name: 'Summer', emoji: '☀️' },
        { id: 'Fall', name: 'Fall', emoji: '🍂' },
        { id: 'Winter', name: 'Winter', emoji: '❄️' }
    ];

    const filteredProducts = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();

        return products.filter(p => {
            const matchesQuery = !q ||
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.season.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q);

            const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
            const matchesSeason = selectedSeason === 'all' || p.season === selectedSeason || p.season === 'Year-round';

            return matchesQuery && matchesCategory && matchesSeason;
        });
    }, [products, searchQuery, selectedCategory, selectedSeason]);

    const handleReset = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSelectedSeason('all');
        setSearchParams({});
    };

    return (
        <main>
            {/* Breadcrumb */}
            <Breadcrumb items={[{ label: 'Produce Guide', active: true }]} />

            {/* Produce Guide Hero */}
            <section className="py-5 bg-white border-bottom">
                <div className="container">
                    <div className="max-w-800">
                        <span className="badge-pill-fresh mb-2 d-inline-block">SEASONAL HARVEST CATALOGUE</span>
                        <h1 className="font-playfair text-fresh mb-2 display-6 fw-bold">Fresh Produce Guide</h1>
                        <p className="text-muted lead mb-0">
                            Discover wholesome fruits, vegetables, fresh herbs, and farm dairy. Learn about growing seasons, natural flavor profiles, and which markets carry them.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter & Search Controls */}
            <section className="py-4 bg-light border-bottom">
                <div className="container">
                    <div className="card border-0 shadow-sm p-4 rounded-4">
                        <div className="row g-3 align-items-end">
                            {/* Search */}
                            <div className="col-lg-5 col-md-6">
                                <label htmlFor="searchProduceInput" className="form-label-fresh">
                                    <i className="fa-solid fa-magnifying-glass text-fresh"></i> Search Produce
                                </label>
                                <input
                                    type="text"
                                    id="searchProduceInput"
                                    className="form-control form-control-fresh"
                                    placeholder="Search by name, description, season..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="col-lg-5 col-md-6">
                                <label htmlFor="produceCategoryFilter" className="form-label-fresh">
                                    <i className="fa-solid fa-layer-group text-fresh"></i> Category
                                </label>
                                <select
                                    id="produceCategoryFilter"
                                    className="form-select form-select-fresh"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    {categories.map(c => (
                                        <option key={c} value={c}>
                                            {c === 'all' ? 'All Categories' : c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Reset Button */}
                            <div className="col-lg-2 col-md-12">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary w-100"
                                    id="btnClearProduceFilters"
                                    onClick={handleReset}
                                >
                                    <i className="fa-solid fa-rotate-left me-1"></i> Reset
                                </button>
                            </div>
                        </div>

                        {/* Season Recommendations Pills */}
                        <div className="pt-3 mt-3 border-top d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                            <div className="d-flex align-items-center gap-2 flex-wrap" id="produceSeasonTabs">
                                {seasonTabs.map(st => (
                                    <button
                                        key={st.id}
                                        type="button"
                                        className={`btn-season-pill ${selectedSeason === st.id ? 'active' : ''}`}
                                        onClick={() => setSelectedSeason(st.id)}
                                    >
                                        {st.emoji} {st.name}
                                    </button>
                                ))}
                            </div>

                            <div className="text-muted small" id="produceResultsCount">
                                Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> Produce Items
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Produce Grid Section */}
            <section className="py-5">
                <div className="container">
                    {filteredProducts.length === 0 ? (
                        <div className="col-12">
                            <div className="empty-state-card text-center p-5 my-4">
                                <div className="empty-icon mb-3"><i className="fa-solid fa-apple-whole"></i></div>
                                <h3 className="font-playfair">No Produce Items Found</h3>
                                <p className="text-muted">
                                    No produce matches your search or filters. Try adjusting your search term or resetting the filters.
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-fresh mt-2"
                                    onClick={handleReset}
                                >
                                    <i className="fa-solid fa-rotate-left me-1"></i> Reset Filters
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="row g-4" id="produceGridContainer">
                            {filteredProducts.map(p => (
                                <div key={p.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                                    <ProduceCard product={p} showMarketCount={true} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
