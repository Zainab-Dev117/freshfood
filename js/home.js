/**
 * FreshFind Home Page Logic
 * Manages Quick Find, Featured Carousel, Seasonal Picks, and Simulated Visitor Counter
 */

document.addEventListener("DOMContentLoaded", function () {
    // Initialize common UI
    if (window.FreshFindUI) {
        FreshFindUI.initGlobalUI("home");
        FreshFindUI.injectFooter();
    }

    let allMarkets = [];
    let allProducts = [];
    let seasonalData = {};
    let userLocation = null;

    // Load datasets
    Promise.all([
        fetch("data/markets.json").then(r => r.json()),
        fetch("data/products.json").then(r => r.json()),
        fetch("data/seasonal.json").then(r => r.json()).catch(() => ({}))
    ]).then(([markets, products, seasonal]) => {
        allMarkets = markets;
        allProducts = products;
        seasonalData = seasonal;

        initQuickFindFilters();
        initFeaturedCarousel();
        initSeasonalPicks();
        initVisitorCounter();
        initGeolocationOnHome();
    }).catch(err => {
        console.error("Error loading home data:", err);
    });

    /**
     * Optional user geolocation detection on Home
     */
    function initGeolocationOnHome() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (pos) {
                    userLocation = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    };
                    // Re-render carousel and quick find cards to include distance
                    renderCarouselSlides();
                    applyQuickFilters();
                },
                function () {
                    // Graceful fallback: continue without user coordinates
                },
                { timeout: 5000 }
            );
        }
    }

    /**
     * Quick Find Section (Requirement 4)
     */
    function initQuickFindFilters() {
        const areaSelect = document.getElementById("quickArea");
        const daySelect = document.getElementById("quickDay");
        const produceSelect = document.getElementById("quickProduce");
        const searchInput = document.getElementById("quickSearchInput");
        const applyBtn = document.getElementById("btnApplyQuickFilters");
        const clearBtn = document.getElementById("btnClearQuickFilters");

        if (!areaSelect || !daySelect || !produceSelect) return;

        // Populate Area dropdown
        const areas = [...new Set(allMarkets.map(m => m.area))].sort();
        areas.forEach(area => {
            const opt = document.createElement("option");
            opt.value = area;
            opt.textContent = area;
            areaSelect.appendChild(opt);
        });

        // Populate Day dropdown
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        days.forEach(day => {
            const opt = document.createElement("option");
            opt.value = day;
            opt.textContent = day;
            daySelect.appendChild(opt);
        });

        // Populate Produce dropdown
        const productNames = [...new Set(allProducts.map(p => p.name))].sort();
        productNames.forEach(prod => {
            const opt = document.createElement("option");
            opt.value = prod;
            opt.textContent = prod;
            produceSelect.appendChild(opt);
        });

        // Apply filters on button click or change
        if (applyBtn) {
            applyBtn.addEventListener("click", function (e) {
                e.preventDefault();
                applyQuickFilters();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener("click", function (e) {
                e.preventDefault();
                if (searchInput) searchInput.value = "";
                areaSelect.value = "";
                daySelect.value = "";
                produceSelect.value = "";
                applyQuickFilters();
            });
        }

        // Live filtering
        [searchInput, areaSelect, daySelect, produceSelect].forEach(el => {
            if (el) {
                el.addEventListener("input", applyQuickFilters);
                el.addEventListener("change", applyQuickFilters);
            }
        });

        // Initial preview
        applyQuickFilters();
    }

    function applyQuickFilters() {
        const searchInput = document.getElementById("quickSearchInput");
        const areaSelect = document.getElementById("quickArea");
        const daySelect = document.getElementById("quickDay");
        const produceSelect = document.getElementById("quickProduce");
        const resultsContainer = document.getElementById("quickSearchResults");
        const countBadge = document.getElementById("quickResultsCount");

        if (!resultsContainer) return;

        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const area = areaSelect ? areaSelect.value : "";
        const day = daySelect ? daySelect.value : "";
        const produce = produceSelect ? produceSelect.value : "";

        const matched = allMarkets.filter(m => {
            // Text search matches name, area, neighborhood, description, or products
            const nameMatch = !query || m.name.toLowerCase().includes(query) ||
                m.area.toLowerCase().includes(query) ||
                (m.neighborhood && m.neighborhood.toLowerCase().includes(query)) ||
                m.description.toLowerCase().includes(query) ||
                (m.products && m.products.some(p => p.toLowerCase().includes(query)));

            const areaMatch = !area || m.area === area;
            const dayMatch = !day || (m.days && m.days.includes(day));
            const produceMatch = !produce || (m.products && m.products.includes(produce));

            return nameMatch && areaMatch && dayMatch && produceMatch;
        });

        if (countBadge) {
            countBadge.textContent = `${matched.length} market${matched.length === 1 ? '' : 's'} found`;
        }

        if (matched.length === 0) {
            resultsContainer.innerHTML = `
                <div class="col-12">
                    <div class="empty-state-card text-center p-5">
                        <div class="empty-icon mb-3"><i class="fa-solid fa-store-slash"></i></div>
                        <h4 class="font-playfair">No Markets Found</h4>
                        <p class="text-muted">No markets match your current filter combination. Try clearing filters to see all available markets.</p>
                        <button class="btn btn-fresh mt-2" onclick="document.getElementById('btnClearQuickFilters').click();">
                            <i class="fa-solid fa-rotate-left me-1"></i> Reset Filters
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        // Render top 4 matching market cards
        resultsContainer.innerHTML = "";
        const displayList = matched.slice(0, 4);

        displayList.forEach(m => {
            const statusInfo = window.FreshFindEngine ? FreshFindEngine.isMarketOpen(m) : { label: "CHECK HOURS", badgeClass: "badge-status-open", iconClass: "fa-solid fa-clock" };
            const isSaved = window.FreshFindStorage ? FreshFindStorage.isBookmarked("market", m.id) : false;

            let distanceHtml = "";
            if (userLocation && m.latitude && m.longitude && window.FreshFindEngine) {
                const dist = FreshFindEngine.calculateDistance(userLocation.lat, userLocation.lng, m.latitude, m.longitude);
                if (dist !== null) {
                    distanceHtml = `<span class="market-distance-pill"><i class="fa-solid fa-location-arrow me-1"></i>${dist} km away</span>`;
                }
            }

            const cardCol = document.createElement("div");
            cardCol.className = "col-lg-3 col-md-6 mb-4";
            cardCol.innerHTML = `
                <div class="market-display-card h-100">
                    <div class="card-img-wrapper">
                        <img src="${m.image}" alt="${m.name}" loading="lazy">
                        <span class="market-status-badge ${statusInfo.badgeClass}">
                            <i class="${statusInfo.iconClass} me-1"></i> ${statusInfo.label}
                        </span>
                        <button class="btn-bookmark-heart ${isSaved ? 'active' : ''}" data-type="market" data-id="${m.id}" aria-label="Bookmark ${m.name}" title="Bookmark">
                            <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                    </div>
                    <div class="card-body-content">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h4 class="market-title">${m.name}</h4>
                        </div>
                        <p class="market-meta text-muted">
                            <i class="fa-solid fa-location-dot me-1 text-fresh"></i> ${m.area}${m.neighborhood ? ` • ${m.neighborhood}` : ''}
                        </p>
                        <p class="market-schedule">
                            <i class="fa-regular fa-calendar-check me-1 text-fresh"></i> ${Array.isArray(m.days) ? m.days.join(", ") : m.days}
                        </p>
                        <p class="market-hours">
                            <i class="fa-regular fa-clock me-1 text-fresh"></i> ${m.hours}
                        </p>
                        ${distanceHtml}
                        <p class="market-summary line-clamp-2 mt-2">${m.description}</p>
                        <div class="market-action-row mt-auto pt-3 border-top">
                            <a href="markets-details.html?id=${m.id}" class="btn btn-fresh btn-sm w-100">
                                View Details <i class="fa-solid fa-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(cardCol);
        });

        bindBookmarkHearts(resultsContainer);
    }

    /**
     * Featured Markets Carousel (Requirement 5)
     * Supports:
     * - Auto-rotation (4s)
     * - Pause on hover
     * - Previous (<) and Next (>)
     * - Indicator dots
     * - Keyboard support (Left/Right arrow keys)
     */
    let currentSlide = 0;
    let carouselTimer = null;
    let isCarouselPaused = false;

    function initFeaturedCarousel() {
        const track = document.getElementById("featuredCarouselTrack");
        const prevBtn = document.getElementById("carouselPrevBtn");
        const nextBtn = document.getElementById("carouselNextBtn");
        const dotsContainer = document.getElementById("carouselDots");
        const container = document.getElementById("featuredCarouselContainer");

        if (!track) return;

        renderCarouselSlides();

        if (prevBtn) {
            prevBtn.addEventListener("click", function () {
                prevSlide();
                restartCarouselTimer();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", function () {
                nextSlide();
                restartCarouselTimer();
            });
        }

        // Pause on hover
        if (container) {
            container.addEventListener("mouseenter", function () {
                isCarouselPaused = true;
            });
            container.addEventListener("mouseleave", function () {
                isCarouselPaused = false;
            });

            // Keyboard navigation
            container.setAttribute("tabindex", "0");
            container.addEventListener("keydown", function (e) {
                if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    prevSlide();
                    restartCarouselTimer();
                } else if (e.key === "ArrowRight") {
                    e.preventDefault();
                    nextSlide();
                    restartCarouselTimer();
                }
            });
        }

        startCarouselAutoRotation();
    }

    function renderCarouselSlides() {
        const track = document.getElementById("featuredCarouselTrack");
        const dotsContainer = document.getElementById("carouselDots");
        if (!track) return;

        track.innerHTML = "";
        if (dotsContainer) dotsContainer.innerHTML = "";

        const featuredMarkets = allMarkets.slice(0, 6);

        featuredMarkets.forEach((m, idx) => {
            const statusInfo = window.FreshFindEngine ? FreshFindEngine.isMarketOpen(m) : { label: "OPEN NOW", badgeClass: "badge-status-open", iconClass: "fa-solid fa-circle-check" };
            const isSaved = window.FreshFindStorage ? FreshFindStorage.isBookmarked("market", m.id) : false;

            let distanceHtml = "";
            if (userLocation && m.latitude && m.longitude && window.FreshFindEngine) {
                const dist = FreshFindEngine.calculateDistance(userLocation.lat, userLocation.lng, m.latitude, m.longitude);
                if (dist !== null) {
                    distanceHtml = `<span class="slide-distance-pill"><i class="fa-solid fa-location-arrow me-1"></i>${dist} km away</span>`;
                }
            }

            const slide = document.createElement("div");
            slide.className = `carousel-slide ${idx === currentSlide ? 'active' : ''}`;
            slide.setAttribute("data-index", idx);

            slide.innerHTML = `
                <div class="carousel-card-inner">
                    <div class="slide-image-col">
                        <img src="${m.image}" alt="${m.name}" loading="lazy">
                        <span class="slide-status-badge ${statusInfo.badgeClass}">
                            <i class="${statusInfo.iconClass} me-1"></i> ${statusInfo.label}
                        </span>
                    </div>
                    <div class="slide-content-col">
                        <div class="slide-badge-row d-flex justify-content-between align-items-center">
                            <span class="badge-featured-tag"><i class="fa-solid fa-star me-1"></i> Featured Market</span>
                            <button class="btn-bookmark-heart ${isSaved ? 'active' : ''}" data-type="market" data-id="${m.id}" aria-label="Bookmark ${m.name}" title="Bookmark">
                                <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                            </button>
                        </div>
                        <h3 class="slide-market-title font-playfair">${m.name}</h3>
                        <p class="slide-location-text">
                            <i class="fa-solid fa-location-dot text-fresh me-1"></i> ${m.area}${m.neighborhood ? ` (${m.neighborhood})` : ''}
                        </p>
                        <p class="slide-schedule-text">
                            <i class="fa-regular fa-calendar-days text-fresh me-1"></i> ${Array.isArray(m.days) ? m.days.join(" • ") : m.days}
                        </p>
                        <p class="slide-time-text">
                            <i class="fa-regular fa-clock text-fresh me-1"></i> ${m.hours}
                        </p>
                        ${distanceHtml}
                        <p class="slide-desc-text mt-2">${m.description}</p>
                        <div class="slide-actions-row mt-3 d-flex gap-2">
                            <a href="markets-details.html?id=${m.id}" class="btn btn-fresh">
                                <i class="fa-solid fa-store me-1"></i> View Details
                            </a>
                            <button class="btn btn-outline-fresh btn-share-trigger" onclick="FreshFindStorage.shareContent('${m.name}', 'Explore ${m.name} in ${m.area}', window.location.origin + '/markets-details.html?id=${m.id}')">
                                <i class="fa-solid fa-share-nodes me-1"></i> Share
                            </button>
                        </div>
                    </div>
                </div>
            `;
            track.appendChild(slide);

            // Add dot indicator
            if (dotsContainer) {
                const dot = document.createElement("button");
                dot.className = `carousel-dot ${idx === currentSlide ? 'active' : ''}`;
                dot.setAttribute("aria-label", `Slide ${idx + 1}`);
                dot.addEventListener("click", function () {
                    goToSlide(idx);
                    restartCarouselTimer();
                });
                dotsContainer.appendChild(dot);
            }
        });

        bindBookmarkHearts(track);
    }

    function goToSlide(index) {
        const slides = document.querySelectorAll(".carousel-slide");
        const dots = document.querySelectorAll(".carousel-dot");
        if (slides.length === 0) return;

        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));

        currentSlide = (index + slides.length) % slides.length;

        if (slides[currentSlide]) slides[currentSlide].classList.add("active");
        if (dots[currentSlide]) dots[currentSlide].classList.add("active");
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startCarouselAutoRotation() {
        if (carouselTimer) clearInterval(carouselTimer);
        carouselTimer = setInterval(function () {
            if (!isCarouselPaused) {
                nextSlide();
            }
        }, 4500);
    }

    function restartCarouselTimer() {
        startCarouselAutoRotation();
    }

    /**
     * Seasonal Picks (Requirement 6 & 29)
     * Dynamically calculates season via Date
     */
    function initSeasonalPicks() {
        const container = document.getElementById("seasonalProductsContainer");
        const titleBadge = document.getElementById("currentSeasonBadge");
        const seasonDesc = document.getElementById("currentSeasonDesc");
        const tabsContainer = document.getElementById("seasonPillsList");

        if (!container) return;

        // Current Season calculated from JavaScript
        const currentSeasonObj = window.FreshFindEngine ? FreshFindEngine.getCurrentSeason() : { id: "Fall", name: "Autumn / Fall", icon: "fa-leaf", color: "#d97706", emoji: "🍂" };

        if (titleBadge) {
            titleBadge.innerHTML = `<span class="season-badge-glow" style="background-color:${currentSeasonObj.color};">${currentSeasonObj.emoji} ${currentSeasonObj.name.toUpperCase()} SELECTION</span>`;
        }

        if (seasonDesc && seasonalData[currentSeasonObj.id]) {
            seasonDesc.textContent = seasonalData[currentSeasonObj.id].description || "Fresh local produce harvested in this peak season.";
        }

        // Render season selector tabs
        if (tabsContainer) {
            const allSeasons = [
                { id: "Spring", name: "Spring", emoji: "🌱" },
                { id: "Summer", name: "Summer", emoji: "☀️" },
                { id: "Fall", name: "Fall / Autumn", emoji: "🍂" },
                { id: "Winter", name: "Winter", emoji: "❄️" }
            ];

            tabsContainer.innerHTML = "";
            allSeasons.forEach(s => {
                const isCurrent = s.id === currentSeasonObj.id;
                const btn = document.createElement("button");
                btn.className = `btn-season-pill ${isCurrent ? 'active' : ''}`;
                btn.innerHTML = `${s.emoji} ${s.name} ${isCurrent ? '<span class="current-tag">NOW</span>' : ''}`;
                btn.addEventListener("click", function () {
                    document.querySelectorAll(".btn-season-pill").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    renderSeasonalCards(s.id);
                });
                tabsContainer.appendChild(btn);
            });
        }

        // Render current season items initially
        renderSeasonalCards(currentSeasonObj.id);
    }

    function renderSeasonalCards(seasonKey) {
        const container = document.getElementById("seasonalProductsContainer");
        if (!container) return;

        container.innerHTML = "";

        // Filter products matching this season (or Year-round)
        const matchingProducts = allProducts.filter(p => p.season === seasonKey || p.season === "Year-round").slice(0, 8);

        matchingProducts.forEach(prod => {
            const isSaved = window.FreshFindStorage ? FreshFindStorage.isBookmarked("produce", prod.id) : false;
            const marketCount = prod.markets ? prod.markets.length : 1;

            const cardCol = document.createElement("div");
            cardCol.className = "col-lg-3 col-md-6 mb-4";
            cardCol.innerHTML = `
                <div class="produce-display-card h-100">
                    <div class="produce-img-box">
                        <img src="${prod.image}" alt="${prod.name}" loading="lazy">
                        <span class="produce-category-badge">${prod.category}</span>
                        <button class="btn-bookmark-heart ${isSaved ? 'active' : ''}" data-type="produce" data-id="${prod.id}" aria-label="Bookmark ${prod.name}" title="Bookmark">
                            <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                    </div>
                    <div class="produce-body-box">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h4 class="produce-name mb-0">${prod.name}</h4>
                            <span class="season-pill-mini"><i class="fa-regular fa-calendar me-1"></i> ${prod.season}</span>
                        </div>
                        <p class="produce-summary line-clamp-2 mt-2">${prod.description}</p>
                        <p class="available-markets-indicator">
                            <i class="fa-solid fa-store me-1 text-fresh"></i> Available at <strong>${marketCount}</strong> local market${marketCount === 1 ? '' : 's'}
                        </p>
                        <div class="mt-auto pt-2 border-top">
                            <a href="produce-detail.html?id=${prod.id}" class="btn btn-outline-fresh btn-sm w-100">
                                View Produce Guide <i class="fa-solid fa-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(cardCol);
        });

        bindBookmarkHearts(container);
    }

    /**
     * Visitor Counter (Requirement 9)
     * "12,458+ Visitors Exploring FreshFind" with clear simulated note
     */
    function initVisitorCounter() {
        const counterEl = document.getElementById("visitorCounterNum");
        if (!counterEl) return;

        let targetNumber = 12458;
        let startNumber = 11980;
        let duration = 2000;
        let startTime = null;

        function animateCount(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const current = Math.floor(progress * (targetNumber - startNumber) + startNumber);
            counterEl.textContent = current.toLocaleString() + "+";

            if (progress < 1) {
                requestAnimationFrame(animateCount);
            } else {
                // Occasional simulated visitor increment
                setInterval(() => {
                    targetNumber += Math.floor(Math.random() * 3) + 1;
                    counterEl.textContent = targetNumber.toLocaleString() + "+";
                }, 12000);
            }
        }

        // Animate on scroll visibility
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(animateCount);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(counterEl);
    }

    /**
     * Binds bookmark heart clicks
     */
    function bindBookmarkHearts(scopeContainer) {
        const hearts = (scopeContainer || document).querySelectorAll(".btn-bookmark-heart");
        hearts.forEach(btn => {
            btn.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                const type = btn.getAttribute("data-type");
                const id = btn.getAttribute("data-id");
                if (window.FreshFindStorage) {
                    const isAdded = FreshFindStorage.toggleBookmark(type, id);
                    if (isAdded) {
                        btn.classList.add("active");
                        btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
                        FreshFindUI.showToast(`Saved to Bookmarks!`, "success");
                    } else {
                        btn.classList.remove("active");
                        btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
                        FreshFindUI.showToast(`Removed from Bookmarks.`, "info");
                    }
                }
            };
        });
    }

});
