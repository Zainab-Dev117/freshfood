/**
 * FreshFind Produce Guide
 * Handles produce search, category filter, seasonal tabs, and produce cards (Requirements 24-27, 29)
 */

document.addEventListener("DOMContentLoaded", function () {
    if (window.FreshFindUI) {
        FreshFindUI.initGlobalUI("produce");
        FreshFindUI.injectFooter();
    }

    let allProducts = [];
    let allMarkets = [];
    let activeCategory = "all";
    let activeSeason = "all";

    // Load data
    Promise.all([
        fetch("data/products.json").then(r => r.json()),
        fetch("data/markets.json").then(r => r.json())
    ]).then(([products, markets]) => {
        allProducts = products;
        allMarkets = markets;

        initProduceControls();
        renderProduceList();
    }).catch(err => {
        console.error("Error loading produce guide:", err);
    });

    /**
     * Initializes search, category filter, and season filter tabs
     */
    function initProduceControls() {
        const searchInput = document.getElementById("searchProduceInput");
        const categorySelect = document.getElementById("produceCategoryFilter");
        const clearBtn = document.getElementById("btnClearProduceFilters");
        const seasonTabsContainer = document.getElementById("produceSeasonTabs");

        // Category filter
        if (categorySelect) {
            categorySelect.addEventListener("change", function () {
                activeCategory = categorySelect.value;
                renderProduceList();
            });
        }

        // Search input
        if (searchInput) {
            searchInput.addEventListener("input", renderProduceList);
        }

        // Clear button
        if (clearBtn) {
            clearBtn.addEventListener("click", function () {
                if (searchInput) searchInput.value = "";
                if (categorySelect) categorySelect.value = "all";
                activeCategory = "all";
                activeSeason = "all";
                updateSeasonTabsUI();
                renderProduceList();
            });
        }

        // Render Season Filter Pills (Requirement 29)
        if (seasonTabsContainer) {
            const currentSeason = window.FreshFindEngine ? FreshFindEngine.getCurrentSeason() : { id: "Fall", name: "Fall" };

            const seasons = [
                { id: "all", name: "All Seasons", icon: "fa-earth-americas" },
                { id: "Spring", name: "Spring", icon: "fa-seedling" },
                { id: "Summer", name: "Summer", icon: "fa-sun" },
                { id: "Fall", name: "Autumn / Fall", icon: "fa-leaf" },
                { id: "Winter", name: "Winter", icon: "fa-snowflake" },
                { id: "Year-round", name: "Year-round", icon: "fa-arrows-rotate" }
            ];

            seasonTabsContainer.innerHTML = "";
            seasons.forEach(s => {
                const isCurrent = s.id === currentSeason.id;
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = `season-tab-btn ${s.id === activeSeason ? 'active' : ''}`;
                btn.setAttribute("data-season", s.id);
                btn.innerHTML = `
                    <i class="fa-solid ${s.icon} me-1"></i> ${s.name}
                    ${isCurrent ? '<span class="badge-current-season ms-1">CURRENT</span>' : ''}
                `;

                btn.addEventListener("click", function () {
                    activeSeason = s.id;
                    updateSeasonTabsUI();
                    renderProduceList();
                });

                seasonTabsContainer.appendChild(btn);
            });
        }
    }

    function updateSeasonTabsUI() {
        const buttons = document.querySelectorAll(".season-tab-btn");
        buttons.forEach(btn => {
            const sId = btn.getAttribute("data-season");
            if (sId === activeSeason) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    /**
     * Renders Produce Cards Grid (Requirement 27)
     */
    function renderProduceList() {
        const searchInput = document.getElementById("searchProduceInput");
        const container = document.getElementById("produceGridContainer");
        const countDisplay = document.getElementById("produceResultsCount");

        if (!container) return;

        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

        const filtered = allProducts.filter(p => {
            const nameMatch = !query ||
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query) ||
                p.season.toLowerCase().includes(query);

            const categoryMatch = activeCategory === "all" || p.category.toLowerCase() === activeCategory.toLowerCase();
            const seasonMatch = activeSeason === "all" || p.season.toLowerCase() === activeSeason.toLowerCase();

            return nameMatch && categoryMatch && seasonMatch;
        });

        // Results count
        if (countDisplay) {
            countDisplay.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${allProducts.length}</strong> Produce Items`;
        }

        // Empty state
        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="empty-state-card text-center p-5 my-4">
                        <div class="empty-icon mb-3"><i class="fa-solid fa-seedling"></i></div>
                        <h3 class="font-playfair">No Produce Items Found</h3>
                        <p class="text-muted">No produce matches your search or selected category. Try selecting 'All Categories' or 'All Seasons'.</p>
                        <button class="btn btn-fresh mt-2" onclick="document.getElementById('btnClearProduceFilters').click();">
                            <i class="fa-solid fa-rotate-left me-1"></i> Reset Filters
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = "";
        filtered.forEach(prod => {
            const isSaved = window.FreshFindStorage ? FreshFindStorage.isBookmarked("produce", prod.id) : false;
            const marketCount = (prod.markets || []).length;

            const col = document.createElement("div");
            col.className = "col-lg-3 col-md-4 col-sm-6 mb-4";
            col.innerHTML = `
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
                        <div class="mt-auto pt-2 border-top d-flex gap-2">
                            <a href="produce-detail.html?id=${prod.id}" class="btn btn-fresh btn-sm flex-grow-1">
                                View Details <i class="fa-solid fa-arrow-right ms-1"></i>
                            </a>
                            <button class="btn btn-outline-fresh btn-sm" onclick="FreshFindStorage.shareContent('${prod.name}', 'Fresh seasonal ${prod.name} on FreshFind', window.location.origin + '/produce-detail.html?id=${prod.id}')" title="Share">
                                <i class="fa-solid fa-share-nodes"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });

        // Bind bookmark buttons
        container.querySelectorAll(".btn-bookmark-heart").forEach(btn => {
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
                        FreshFindUI.showToast("Saved to Bookmarks!", "success");
                    } else {
                        btn.classList.remove("active");
                        btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
                        FreshFindUI.showToast("Removed from Bookmarks.", "info");
                    }
                }
            };
        });
    }

});
