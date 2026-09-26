/**
 * FreshFind Market Detail Logic
 * Implements interactive Leaflet map, 7-day highlighted schedule table,
 * real-time Open/Closed status, and available produce relations (Requirements 18-23)
 */

document.addEventListener("DOMContentLoaded", function () {
    if (window.FreshFindUI) {
        FreshFindUI.initGlobalUI("directory");
        FreshFindUI.injectFooter();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const marketId = parseInt(urlParams.get("id"), 10) || 1;

    let currentMarket = null;
    let allProducts = [];
    let leafletMapInstance = null;

    // Load data
    Promise.all([
        fetch("data/markets.json").then(r => r.json()),
        fetch("data/products.json").then(r => r.json())
    ]).then(([markets, products]) => {
        allProducts = products;
        currentMarket = markets.find(m => m.id === marketId) || markets[0];

        if (currentMarket) {
            renderMarketHeader(currentMarket);
            renderWeeklySchedule(currentMarket);
            renderLocationAndMap(currentMarket);
            renderAvailableProduce(currentMarket);
            bindHeaderActions(currentMarket);
        }
    }).catch(err => {
        console.error("Error loading market details:", err);
    });

    /**
     * Renders Header, Breadcrumb, and Status (Requirement 18 & 22)
     */
    function renderMarketHeader(market) {
        // Document title & breadcrumb
        document.title = `${market.name} - FreshFind Market Directory`;
        const breadcrumbName = document.getElementById("detailBreadcrumbMarketName");
        if (breadcrumbName) breadcrumbName.textContent = market.name;

        // Image
        const imgEl = document.getElementById("marketDetailImage");
        if (imgEl) {
            imgEl.src = market.image;
            imgEl.alt = market.name;
        }

        // Titles and metadata
        const nameEl = document.getElementById("marketDetailName");
        const areaEl = document.getElementById("marketDetailArea");
        const addrEl = document.getElementById("marketDetailAddress");
        const descEl = document.getElementById("marketDetailDesc");
        const statusBadge = document.getElementById("marketDetailStatusBadge");
        const nextOpenNotice = document.getElementById("marketDetailNextNotice");

        if (nameEl) nameEl.textContent = market.name;
        if (areaEl) areaEl.innerHTML = `<i class="fa-solid fa-location-dot text-fresh me-1"></i> ${market.area}${market.neighborhood ? ` • ${market.neighborhood}` : ''}`;
        if (addrEl) addrEl.textContent = market.address;
        if (descEl) descEl.textContent = market.description;

        // Reusable Open/Closed calculation (Requirement 22)
        if (window.FreshFindEngine) {
            const statusInfo = FreshFindEngine.isMarketOpen(market);
            if (statusBadge) {
                statusBadge.className = `market-status-badge ${statusInfo.badgeClass}`;
                statusBadge.innerHTML = `<i class="${statusInfo.iconClass} me-1"></i> ${statusInfo.label}`;
            }
            if (nextOpenNotice) {
                nextOpenNotice.innerHTML = `<i class="fa-regular fa-clock me-1"></i> ${statusInfo.detail}`;
            }
        }
    }

    /**
     * Renders 7-Day Weekly Schedule Table with Today Highlighted (Requirement 21)
     */
    function renderWeeklySchedule(market) {
        const scheduleContainer = document.getElementById("marketScheduleTableContainer");
        if (!scheduleContainer || !window.FreshFindEngine) return;

        const scheduleDays = FreshFindEngine.getWeeklySchedule(market);

        let tableHtml = `
            <div class="table-responsive">
                <table class="table schedule-table-custom align-middle">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Opening</th>
                            <th>Closing</th>
                            <th>Operating Status</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        scheduleDays.forEach(row => {
            const rowClass = row.isToday ? "schedule-row-today" : "";
            const todayBadge = row.isToday ? `<span class="badge-today-tag ms-2">TODAY</span>` : "";
            const statusBadge = row.isOpenDay ?
                `<span class="badge-open-day"><i class="fa-solid fa-circle-check me-1"></i> Open</span>` :
                `<span class="badge-closed-day"><i class="fa-solid fa-minus me-1"></i> Closed</span>`;

            tableHtml += `
                <tr class="${rowClass}">
                    <td class="fw-bold">${row.day} ${todayBadge}</td>
                    <td>${row.opening}</td>
                    <td>${row.closing}</td>
                    <td>${statusBadge}</td>
                </tr>
            `;
        });

        tableHtml += `
                    </tbody>
                </table>
            </div>
        `;

        scheduleContainer.innerHTML = tableHtml;
    }

    /**
     * Renders Location Information & Interactive Leaflet Map (Requirements 19 & 20)
     */
    function renderLocationAndMap(market) {
        const fullAddrEl = document.getElementById("marketFullAddress");
        const areaInfoEl = document.getElementById("marketAreaInfo");
        const coordsEl = document.getElementById("marketCoordsInfo");
        const mapContainer = document.getElementById("marketDetailMap");

        if (fullAddrEl) fullAddrEl.textContent = market.address;
        if (areaInfoEl) areaInfoEl.textContent = `${market.area} (${market.neighborhood || 'Central Zone'})`;
        if (coordsEl && market.latitude && market.longitude) {
            coordsEl.textContent = `${market.latitude.toFixed(4)}° N, ${market.longitude.toFixed(4)}° E`;
        }

        if (!mapContainer || !window.L || !market.latitude || !market.longitude) return;

        // Clean previous map instance if any
        if (leafletMapInstance) {
            leafletMapInstance.remove();
        }

        // Initialize Leaflet Map
        leafletMapInstance = L.map('marketDetailMap').setView([market.latitude, market.longitude], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(leafletMapInstance);

        // Marker with custom popup
        const marker = L.marker([market.latitude, market.longitude]).addTo(leafletMapInstance);
        marker.bindPopup(`
            <div style="font-family: 'DM Sans', sans-serif;">
                <h6 style="margin: 0 0 4px; font-weight: 700; color: #2C4D3F;">${market.name}</h6>
                <p style="margin: 0 0 4px; font-size: 12px; color: #666;">${market.address}</p>
                <span style="font-size: 11px; background: #eef1e6; color: #2c4d3f; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
                    ${market.hours}
                </span>
            </div>
        `).openPopup();
    }

    /**
     * Renders Available Produce (Requirement 23)
     */
    function renderAvailableProduce(market) {
        const produceGrid = document.getElementById("marketProduceGrid");
        if (!produceGrid) return;

        // Filter products available at this market
        const availableProducts = allProducts.filter(p => (p.markets || []).includes(market.id));

        if (availableProducts.length === 0) {
            produceGrid.innerHTML = `
                <div class="col-12">
                    <p class="text-muted">Produce catalogue updating for this market.</p>
                </div>
            `;
            return;
        }

        produceGrid.innerHTML = "";
        availableProducts.forEach(prod => {
            const isSaved = window.FreshFindStorage ? FreshFindStorage.isBookmarked("produce", prod.id) : false;

            const col = document.createElement("div");
            col.className = "col-lg-3 col-md-4 col-sm-6 mb-4";
            col.innerHTML = `
                <div class="produce-display-card h-100">
                    <div class="produce-img-box">
                        <img src="${prod.image}" alt="${prod.name}" loading="lazy">
                        <span class="produce-category-badge">${prod.category}</span>
                        <button class="btn-bookmark-heart ${isSaved ? 'active' : ''}" data-type="produce" data-id="${prod.id}" aria-label="Bookmark ${prod.name}">
                            <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                    </div>
                    <div class="produce-body-box">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h4 class="produce-name mb-0">${prod.name}</h4>
                            <span class="season-pill-mini">${prod.season}</span>
                        </div>
                        <p class="produce-summary line-clamp-2 mt-2">${prod.description}</p>
                        <div class="mt-auto pt-2 border-top">
                            <a href="produce-detail.html?id=${prod.id}" class="btn btn-outline-fresh btn-sm w-100">
                                View Produce <i class="fa-solid fa-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            produceGrid.appendChild(col);
        });

        // Bind produce bookmark hearts
        produceGrid.querySelectorAll(".btn-bookmark-heart").forEach(btn => {
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
                        FreshFindUI.showToast("Produce saved to bookmarks!", "success");
                    } else {
                        btn.classList.remove("active");
                        btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
                        FreshFindUI.showToast("Produce removed from bookmarks.", "info");
                    }
                }
            };
        });
    }

    /**
     * Binds Bookmark & Share buttons in the Market Detail header
     */
    function bindHeaderActions(market) {
        const bookmarkBtn = document.getElementById("btnDetailBookmark");
        const shareBtn = document.getElementById("btnDetailShare");
        const noteBtn = document.getElementById("btnDetailAddNote");

        if (bookmarkBtn && window.FreshFindStorage) {
            const isSaved = FreshFindStorage.isBookmarked("market", market.id);
            updateBookmarkBtnState(bookmarkBtn, isSaved);

            bookmarkBtn.onclick = function () {
                const added = FreshFindStorage.toggleBookmark("market", market.id);
                updateBookmarkBtnState(bookmarkBtn, added);
                FreshFindUI.showToast(added ? "Market bookmarked!" : "Market removed from bookmarks.", added ? "success" : "info");
            };
        }

        if (shareBtn && window.FreshFindStorage) {
            shareBtn.onclick = function () {
                FreshFindStorage.shareContent(
                    market.name,
                    `Discover ${market.name} in ${market.area} on FreshFind!`,
                    window.location.href
                );
            };
        }

        if (noteBtn && window.FreshFindUI) {
            noteBtn.onclick = function () {
                FreshFindUI.openNoteModal(`market_${market.id}`, market.name);
            };
        }
    }

    function updateBookmarkBtnState(btn, isSaved) {
        if (isSaved) {
            btn.classList.add("active");
            btn.innerHTML = `<i class="fa-solid fa-heart me-1 text-danger"></i> Bookmarked`;
        } else {
            btn.classList.remove("active");
            btn.innerHTML = `<i class="fa-regular fa-heart me-1"></i> Bookmark`;
        }
    }
});