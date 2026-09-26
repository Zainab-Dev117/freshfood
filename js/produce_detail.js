/**
 * FreshFind Produce Detail Logic
 * Displays comprehensive produce information and clickable available markets (Requirement 28)
 */

document.addEventListener("DOMContentLoaded", function () {
    if (window.FreshFindUI) {
        FreshFindUI.initGlobalUI("produce");
        FreshFindUI.injectFooter();
    }

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id"), 10) || 1;

    let currentProduct = null;
    let allMarkets = [];

    // Load data
    Promise.all([
        fetch("data/products.json").then(r => r.json()),
        fetch("data/markets.json").then(r => r.json())
    ]).then(([products, markets]) => {
        allMarkets = markets;
        currentProduct = products.find(p => p.id === productId) || products[0];

        if (currentProduct) {
            renderProductDetails(currentProduct);
            renderAvailableMarkets(currentProduct);
            bindProduceActions(currentProduct);
        }
    }).catch(err => {
        console.error("Error loading product detail:", err);
    });

    /**
     * Renders Produce Information (Requirement 28)
     */
    function renderProductDetails(product) {
        document.title = `${product.name} - FreshFind Produce Guide`;

        const breadcrumbEl = document.getElementById("detailBreadcrumbProduceName");
        const imgEl = document.getElementById("produceDetailImage");
        const nameEl = document.getElementById("produceDetailName");
        const catEl = document.getElementById("produceDetailCategory");
        const descEl = document.getElementById("produceDetailDesc");
        const seasonEl = document.getElementById("produceDetailSeason");

        if (breadcrumbEl) breadcrumbEl.textContent = product.name;
        if (imgEl) {
            imgEl.src = product.image;
            imgEl.alt = product.name;
        }
        if (nameEl) nameEl.textContent = product.name;
        if (catEl) catEl.textContent = product.category;
        if (descEl) descEl.textContent = product.description;
        if (seasonEl) seasonEl.textContent = product.season;
    }

    /**
     * Renders Clickable Available Markets (Requirement 28)
     */
    function renderAvailableMarkets(product) {
        const container = document.getElementById("produceAvailableMarketsGrid");
        if (!container) return;

        const marketIds = product.markets || [];
        const carryingMarkets = allMarkets.filter(m => marketIds.includes(m.id));

        if (carryingMarkets.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <p class="text-muted">Market availability currently being updated.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = "";
        carryingMarkets.forEach(m => {
            const statusInfo = window.FreshFindEngine ? FreshFindEngine.isMarketOpen(m) : { label: "CHECK HOURS", badgeClass: "badge-status-open", iconClass: "fa-solid fa-clock" };
            const isSaved = window.FreshFindStorage ? FreshFindStorage.isBookmarked("market", m.id) : false;

            const col = document.createElement("div");
            col.className = "col-lg-4 col-md-6 mb-4";
            col.innerHTML = `
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
                        <h4 class="market-title">${m.name}</h4>
                        <p class="market-meta text-muted">
                            <i class="fa-solid fa-location-dot text-fresh me-1"></i> ${m.area}${m.neighborhood ? ` • ${m.neighborhood}` : ''}
                        </p>
                        <p class="market-schedule">
                            <i class="fa-regular fa-calendar-check text-fresh me-1"></i> ${Array.isArray(m.days) ? m.days.join(", ") : m.days}
                        </p>
                        <p class="market-hours">
                            <i class="fa-regular fa-clock text-fresh me-1"></i> ${m.hours}
                        </p>
                        <div class="mt-auto pt-3 border-top">
                            <!-- Clickable Market Link (Requirement 28: Har market clickable hoga) -->
                            <a href="markets-details.html?id=${m.id}" class="btn btn-fresh btn-sm w-100">
                                View Market Details <i class="fa-solid fa-arrow-right ms-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });

        // Bind market bookmark hearts
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

    /**
     * Binds Bookmark, Share & Note actions
     */
    function bindProduceActions(product) {
        const bookmarkBtn = document.getElementById("btnProduceBookmark");
        const shareBtn = document.getElementById("btnProduceShare");
        const noteBtn = document.getElementById("btnProduceAddNote");

        if (bookmarkBtn && window.FreshFindStorage) {
            const isSaved = FreshFindStorage.isBookmarked("produce", product.id);
            updateBookmarkBtn(bookmarkBtn, isSaved);

            bookmarkBtn.onclick = function () {
                const added = FreshFindStorage.toggleBookmark("produce", product.id);
                updateBookmarkBtn(bookmarkBtn, added);
                FreshFindUI.showToast(added ? "Produce bookmarked!" : "Produce removed from bookmarks.", added ? "success" : "info");
            };
        }

        if (shareBtn && window.FreshFindStorage) {
            shareBtn.onclick = function () {
                FreshFindStorage.shareContent(
                    `${product.name} Produce Guide`,
                    `Find fresh seasonal ${product.name} at local farmers markets!`,
                    window.location.href
                );
            };
        }

        if (noteBtn && window.FreshFindUI) {
            noteBtn.onclick = function () {
                FreshFindUI.openNoteModal(`produce_${product.id}`, product.name);
            };
        }
    }

    function updateBookmarkBtn(btn, isSaved) {
        if (isSaved) {
            btn.classList.add("active");
            btn.innerHTML = `<i class="fa-solid fa-heart me-1 text-danger"></i> Bookmarked`;
        } else {
            btn.classList.remove("active");
            btn.innerHTML = `<i class="fa-regular fa-heart me-1"></i> Bookmark`;
        }
    }

});
