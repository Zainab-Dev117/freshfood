/**
 * FreshFind Market Directory & Discovery
 * Handles comprehensive search, area/day/produce filters, sorting (A-Z, Z-A, Nearest, Next Open),
 * Geolocation with Haversine formula, and status badges (Requirements 11-17)
 */

document.addEventListener("DOMContentLoaded", function () {
    if (window.FreshFindUI) {
        FreshFindUI.initGlobalUI("directory");
        FreshFindUI.injectFooter();
    }

    let allMarkets = [];
    let allProducts = [];
    let userCoords = null;
    let locationStatus = "idle"; // "idle" | "granted" | "denied"

    // Load datasets
    Promise.all([
        fetch("data/markets.json").then(r => r.json()),
        fetch("data/products.json").then(r => r.json())
    ]).then(([markets, products]) => {
        allMarkets = markets;
        allProducts = products;

        initDirectoryControls();
        checkUrlQueryFilters();
        renderDirectory();
    }).catch(err => {
        console.error("Error loading directory data:", err);
    });

    /**
     * Initializes filters, search, sort, and geolocation button
     */
    function initDirectoryControls() {
        const areaSelect = document.getElementById("directoryArea");
        const daySelect = document.getElementById("directoryDay");
        const produceSelect = document.getElementById("directoryProduce");
        const sortSelect = document.getElementById("directorySort");
        const searchInput = document.getElementById("directorySearch");
        const clearBtn = document.getElementById("btnClearDirectoryFilters");
        const geoBtn = document.getElementById("btnUseMyLocation");

        // Fill Area dropdown
        if (areaSelect) {
            const areas = [...new Set(allMarkets.map(m => m.area))].sort();
            areas.forEach(area => {
                const opt = document.createElement("option");
                opt.value = area;
                opt.textContent = area;
                areaSelect.appendChild(opt);
            });
            areaSelect.addEventListener("change", renderDirectory);
        }

        // Fill Day dropdown
        if (daySelect) {
            const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            days.forEach(day => {
                const opt = document.createElement("option");
                opt.value = day;
                opt.textContent = day;
                daySelect.appendChild(opt);
            });
            daySelect.addEventListener("change", renderDirectory);
        }

        // Fill Produce dropdown from products.json
        if (produceSelect) {
            const prodNames = [...new Set(allProducts.map(p => p.name))].sort();
            prodNames.forEach(p => {
                const opt = document.createElement("option");
                opt.value = p;
                opt.textContent = p;
                produceSelect.appendChild(opt);
            });
            produceSelect.addEventListener("change", renderDirectory);
        }

        // Sort event
        if (sortSelect) {
            sortSelect.addEventListener("change", function () {
                if (sortSelect.value === "nearest" && !userCoords) {
                    requestUserLocation(true);
                } else {
                    renderDirectory();
                }
            });
        }

        // Search text input
        if (searchInput) {
            searchInput.addEventListener("input", renderDirectory);
        }

        // Clear all filters
        if (clearBtn) {
            clearBtn.addEventListener("click", function () {
                if (searchInput) searchInput.value = "";
                if (areaSelect) areaSelect.value = "";
                if (daySelect) daySelect.value = "";
                if (produceSelect) produceSelect.value = "";
                if (sortSelect) sortSelect.value = "default";
                renderDirectory();
            });
        }

        // Geolocation Button (Requirement 13)
        if (geoBtn) {
            geoBtn.addEventListener("click", function () {
                requestUserLocation(false);
            });
        }
    }

    /**
     * Handles URL query params (e.g., market.html?day=Saturday or ?produce=Tomatoes)
     */
    function checkUrlQueryFilters() {
        const params = new URLSearchParams(window.location.search);
        const dayParam = params.get("day");
        const areaParam = params.get("area");
        const produceParam = params.get("produce");
        const filterParam = params.get("filter");

        if (dayParam) {
            const daySelect = document.getElementById("directoryDay");
            if (daySelect) daySelect.value = dayParam;
        }

        if (areaParam) {
            const areaSelect = document.getElementById("directoryArea");
            if (areaSelect) areaSelect.value = areaParam;
        }

        if (produceParam) {
            const produceSelect = document.getElementById("directoryProduce");
            if (produceSelect) produceSelect.value = produceParam;
        }

        if (filterParam === "today") {
            const now = new Date();
            const todayName = now.toLocaleDateString("en-US", { weekday: "long" });
            const daySelect = document.getElementById("directoryDay");
            if (daySelect) daySelect.value = todayName;
        }
    }

    /**
     * Browser Geolocation System (Requirement 13)
     */
    function requestUserLocation(triggerSortNearest = false) {
        const geoBtn = document.getElementById("btnUseMyLocation");
        const geoMessage = document.getElementById("geoStatusMessage");

        if (!("geolocation" in navigator)) {
            if (window.FreshFindUI) FreshFindUI.showToast("Geolocation is not supported by your browser.", "warning");
            if (geoMessage) geoMessage.textContent = "Geolocation is not supported by your browser.";
            return;
        }

        if (geoBtn) {
            geoBtn.disabled = true;
            geoBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-1"></i> Detecting...`;
        }

        navigator.geolocation.getCurrentPosition(
            function (position) {
                userCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                locationStatus = "granted";

                if (geoBtn) {
                    geoBtn.disabled = false;
                    geoBtn.classList.add("active");
                    geoBtn.innerHTML = `<i class="fa-solid fa-location-crosshairs text-success me-1"></i> Location Active`;
                }

                if (geoMessage) {
                    geoMessage.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check me-1"></i> Location detected! Showing exact distances.</span>`;
                }

                if (window.FreshFindUI) FreshFindUI.showToast("Location detected! Distances calculated.", "success");

                if (triggerSortNearest) {
                    const sortSelect = document.getElementById("directorySort");
                    if (sortSelect) sortSelect.value = "nearest";
                }

                renderDirectory();
            },
            function (error) {
                locationStatus = "denied";
                if (geoBtn) {
                    geoBtn.disabled = false;
                    geoBtn.innerHTML = `<i class="fa-solid fa-location-crosshairs me-1"></i> Use My Location`;
                }

                // Graceful fallback (Requirement 13: Website continue karegi, message display hoga)
                const errorMsg = "Location access is required for distance-based features. You can still search and filter all markets.";
                if (geoMessage) {
                    geoMessage.innerHTML = `<span class="text-muted"><i class="fa-solid fa-circle-info me-1"></i> ${errorMsg}</span>`;
                }

                if (window.FreshFindUI) FreshFindUI.showToast(errorMsg, "info");

                const sortSelect = document.getElementById("directorySort");
                if (sortSelect && sortSelect.value === "nearest") {
                    sortSelect.value = "default";
                }

                renderDirectory();
            },
            { timeout: 8000 }
        );
    }

    /**
     * Renders filtered & sorted market cards
     */
    function renderDirectory() {
        const searchInput = document.getElementById("directorySearch");
        const areaSelect = document.getElementById("directoryArea");
        const daySelect = document.getElementById("directoryDay");
        const produceSelect = document.getElementById("directoryProduce");
        const sortSelect = document.getElementById("directorySort");
        const container = document.getElementById("marketDirectoryCards");
        const countDisplay = document.getElementById("directoryResultsCount");

        if (!container) return;

        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const area = areaSelect ? areaSelect.value : "";
        const day = daySelect ? daySelect.value : "";
        const produce = produceSelect ? produceSelect.value : "";
        const sortBy = sortSelect ? sortSelect.value : "default";

        // Filtering
        let filtered = allMarkets.filter(m => {
            const nameMatch = !query ||
                m.name.toLowerCase().includes(query) ||
                m.area.toLowerCase().includes(query) ||
                (m.neighborhood && m.neighborhood.toLowerCase().includes(query)) ||
                m.description.toLowerCase().includes(query) ||
                (m.products && m.products.some(p => p.toLowerCase().includes(query)));

            const areaMatch = !area || m.area === area;
            const dayMatch = !day || (m.days && m.days.includes(day));
            const produceMatch = !produce || (m.products && m.products.includes(produce));

            return nameMatch && areaMatch && dayMatch && produceMatch;
        });

        // Sorting (Requirement 12)
        if (sortBy === "az") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "za") {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortBy === "nearest") {
            if (userCoords && window.FreshFindEngine) {
                filtered.sort((a, b) => {
                    const distA = FreshFindEngine.calculateDistance(userCoords.lat, userCoords.lng, a.latitude, a.longitude) || 9999;
                    const distB = FreshFindEngine.calculateDistance(userCoords.lat, userCoords.lng, b.latitude, b.longitude) || 9999;
                    return distA - distB;
                });
            }
        } else if (sortBy === "next-open") {
            if (window.FreshFindEngine) {
                const now = new Date();
                filtered.sort((a, b) => {
                    const statusA = FreshFindEngine.isMarketOpen(a, now);
                    const statusB = FreshFindEngine.isMarketOpen(b, now);

                    // Open now comes first
                    if (statusA.isOpen && !statusB.isOpen) return -1;
                    if (!statusA.isOpen && statusB.isOpen) return 1;

                    // Then sort by nearest opening day
                    const daysA = FreshFindEngine.getDaysUntilNextOpen(a, now);
                    const daysB = FreshFindEngine.getDaysUntilNextOpen(b, now);
                    return daysA - daysB;
                });
            }
        }

        // Result count display (Requirement 16)
        if (countDisplay) {
            countDisplay.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${allMarkets.length}</strong> Markets`;
        }

        // Empty state (Requirement 15)
        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="empty-state-card text-center p-5 my-4">
                        <div class="empty-icon mb-3"><i class="fa-solid fa-store-slash"></i></div>
                        <h3 class="font-playfair">No Markets Found</h3>
                        <p class="text-muted">No markets match your selected filters. Try broadening your search or resetting filters.</p>
                        <button class="btn btn-fresh mt-2" onclick="document.getElementById('btnClearDirectoryFilters').click();">
                            <i class="fa-solid fa-rotate-left me-1"></i> Clear All Filters
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        // Render Cards (Requirements 14 & 17)
        container.innerHTML = "";
        filtered.forEach(m => {
            const statusInfo = window.FreshFindEngine ? FreshFindEngine.isMarketOpen(m) : { label: "CHECK HOURS", badgeClass: "badge-status-open", iconClass: "fa-solid fa-clock" };
            const isSaved = window.FreshFindStorage ? FreshFindStorage.isBookmarked("market", m.id) : false;

            let distanceHtml = "";
            if (userCoords && m.latitude && m.longitude && window.FreshFindEngine) {
                const dist = FreshFindEngine.calculateDistance(userCoords.lat, userCoords.lng, m.latitude, m.longitude);
                if (dist !== null) {
                    distanceHtml = `<div class="market-distance-badge"><i class="fa-solid fa-location-arrow me-1"></i> ${dist} km away</div>`;
                }
            }

            // Available produce pills
            const producePills = (m.products || []).slice(0, 3).map(p => `<span class="badge-produce-mini">${p}</span>`).join(" ");

            const cardCol = document.createElement("div");
            cardCol.className = "col-lg-4 col-md-6 mb-4";
            cardCol.innerHTML = `
                <div class="directory-market-card h-100">
                    <div class="card-img-container">
                        <img src="${m.image}" alt="${m.name}" loading="lazy">
                        <!-- Status Badge (uses text + icon, not color alone - Requirement 17) -->
                        <span class="market-status-badge ${statusInfo.badgeClass}">
                            <i class="${statusInfo.iconClass} me-1"></i> ${statusInfo.label}
                        </span>
                        <button class="btn-bookmark-heart ${isSaved ? 'active' : ''}" data-type="market" data-id="${m.id}" aria-label="Bookmark ${m.name}" title="Bookmark">
                            <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                    </div>
                    <div class="card-details-container">
                        <div class="d-flex justify-content-between align-items-start mb-1">
                            <h3 class="directory-card-title">${m.name}</h3>
                        </div>
                        <p class="directory-location-meta">
                            <i class="fa-solid fa-location-dot text-fresh me-1"></i> ${m.area}${m.neighborhood ? ` • ${m.neighborhood}` : ''}
                        </p>
                        <p class="directory-schedule-line">
                            <i class="fa-regular fa-calendar-check text-fresh me-1"></i> ${Array.isArray(m.days) ? m.days.join(" • ") : m.days}
                        </p>
                        <p class="directory-hours-line">
                            <i class="fa-regular fa-clock text-fresh me-1"></i> ${m.hours}
                        </p>
                        ${distanceHtml}
                        <p class="directory-desc-snippet line-clamp-2 mt-2">${m.description}</p>
                        
                        <div class="produce-pills-row my-2">
                            ${producePills}
                        </div>

                        <div class="card-actions-bottom mt-auto pt-3 border-top d-flex gap-2">
                            <a href="markets-details.html?id=${m.id}" class="btn btn-fresh flex-grow-1">
                                View Details <i class="fa-solid fa-arrow-right ms-1"></i>
                            </a>
                            <button class="btn btn-outline-fresh btn-share-sm" onclick="FreshFindStorage.shareContent('${m.name}', 'Farmers market in ${m.area}', window.location.origin + '/markets-details.html?id=${m.id}')" title="Share market">
                                <i class="fa-solid fa-share-nodes"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(cardCol);
        });

        bindBookmarkHearts(container);
    }

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