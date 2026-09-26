/**
 * FreshFind Bookmarks Page Logic
 * Manages Saved Markets, Saved Produce, Session Notes, and Client-side Export (Requirements 30-34)
 */

document.addEventListener("DOMContentLoaded", function () {
    if (window.FreshFindUI) {
        FreshFindUI.initGlobalUI("bookmarks");
        FreshFindUI.injectFooter();
    }

    let allMarkets = [];
    let allProducts = [];

    // Load data
    Promise.all([
        fetch("data/markets.json").then(r => r.json()),
        fetch("data/products.json").then(r => r.json())
    ]).then(([markets, products]) => {
        allMarkets = markets;
        allProducts = products;

        initBookmarksPage();
    }).catch(err => {
        console.error("Error loading bookmarks data:", err);
    });

    function initBookmarksPage() {
        renderBookmarks();

        // Bind Export button (Requirement 33)
        const exportTxtBtn = document.getElementById("btnExportBookmarksTxt");
        const exportJsonBtn = document.getElementById("btnExportBookmarksJson");

        if (exportTxtBtn && window.FreshFindStorage) {
            exportTxtBtn.onclick = function () {
                FreshFindStorage.exportBookmarksFile(allMarkets, allProducts, "txt");
                FreshFindUI.showToast("Bookmarks exported as text file!", "success");
            };
        }

        if (exportJsonBtn && window.FreshFindStorage) {
            exportJsonBtn.onclick = function () {
                FreshFindStorage.exportBookmarksFile(allMarkets, allProducts, "json");
                FreshFindUI.showToast("Bookmarks exported as JSON file!", "success");
            };
        }

        // Listen for notes or bookmarks changed
        window.addEventListener("freshfind_bookmarks_changed", renderBookmarks);
        window.addEventListener("freshfind_notes_changed", renderBookmarks);
    }

    function renderBookmarks() {
        if (!window.FreshFindStorage) return;

        const bookmarks = FreshFindStorage.getBookmarks();
        const notes = FreshFindStorage.getNotes();

        const savedMarkets = allMarkets.filter(m => bookmarks.markets.includes(m.id));
        const savedProduce = allProducts.filter(p => bookmarks.produce.includes(p.id));

        renderSavedMarketsList(savedMarkets, notes);
        renderSavedProduceList(savedProduce, notes);

        // Update counters
        const totalCount = savedMarkets.length + savedProduce.length;
        const totalBadge = document.getElementById("totalBookmarksCountBadge");
        if (totalBadge) totalBadge.textContent = totalCount;
    }

    function renderSavedMarketsList(markets, notes) {
        const container = document.getElementById("savedMarketsContainer");
        const countBadge = document.getElementById("savedMarketsCountBadge");

        if (!container) return;
        if (countBadge) countBadge.textContent = markets.length;

        if (markets.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="empty-state-card text-center p-4">
                        <div class="empty-icon mb-2"><i class="fa-regular fa-heart"></i></div>
                        <h5 class="font-playfair">No Markets Saved Yet</h5>
                        <p class="text-muted">Click the heart icon (♡) on any market card to save it here for easy reference.</p>
                        <a href="market.html" class="btn btn-fresh btn-sm">
                            <i class="fa-solid fa-store me-1"></i> Browse Market Directory
                        </a>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = "";
        markets.forEach(m => {
            const statusInfo = window.FreshFindEngine ? FreshFindEngine.isMarketOpen(m) : { label: "CHECK HOURS", badgeClass: "badge-status-open", iconClass: "fa-solid fa-clock" };
            const noteText = notes[`market_${m.id}`] || "";

            const col = document.createElement("div");
            col.className = "col-lg-6 col-md-12 mb-4";
            col.innerHTML = `
                <div class="bookmark-item-card h-100">
                    <div class="bookmark-card-top d-flex gap-3">
                        <div class="bookmark-img-thumb">
                            <img src="${m.image}" alt="${m.name}">
                        </div>
                        <div class="bookmark-meta-content flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start">
                                <h4 class="bookmark-title mb-1">${m.name}</h4>
                                <button class="btn-remove-bookmark" data-type="market" data-id="${m.id}" title="Remove Bookmark">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                            <p class="text-muted mb-1"><i class="fa-solid fa-location-dot text-fresh me-1"></i> ${m.area}${m.neighborhood ? ` (${m.neighborhood})` : ''}</p>
                            <p class="text-muted mb-1"><i class="fa-regular fa-clock text-fresh me-1"></i> ${m.hours}</p>
                            <span class="market-status-badge ${statusInfo.badgeClass} mb-2">
                                <i class="${statusInfo.iconClass} me-1"></i> ${statusInfo.label}
                            </span>
                        </div>
                    </div>

                    <!-- Session Note Section (Requirement 32) -->
                    <div class="session-note-box mt-3 p-3 bg-light rounded">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="note-label"><i class="fa-solid fa-note-sticky text-warning me-1"></i> Session Note:</span>
                            <button class="btn-edit-note btn-link-action" data-key="market_${m.id}" data-title="${m.name}">
                                <i class="fa-solid ${noteText ? 'fa-pen' : 'fa-plus'} me-1"></i> ${noteText ? 'Edit' : 'Add Note'}
                            </button>
                        </div>
                        <p class="note-text mb-0 ${noteText ? '' : 'text-muted fst-italic'}">
                            ${noteText ? `"${noteText}"` : 'No personal note added yet. Click "Add Note" to set a visit reminder.'}
                        </p>
                    </div>

                    <div class="bookmark-card-actions mt-3 pt-2 border-top d-flex gap-2">
                        <a href="markets-details.html?id=${m.id}" class="btn btn-fresh btn-sm flex-grow-1">
                            View Market <i class="fa-solid fa-arrow-right ms-1"></i>
                        </a>
                        <button class="btn btn-outline-fresh btn-sm" onclick="FreshFindStorage.shareContent('${m.name}', 'Saved market in ${m.area}', window.location.origin + '/markets-details.html?id=${m.id}')" title="Share">
                            <i class="fa-solid fa-share-nodes"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });

        bindBookmarkItemActions(container);
    }

    function renderSavedProduceList(produceList, notes) {
        const container = document.getElementById("savedProduceContainer");
        const countBadge = document.getElementById("savedProduceCountBadge");

        if (!container) return;
        if (countBadge) countBadge.textContent = produceList.length;

        if (produceList.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="empty-state-card text-center p-4">
                        <div class="empty-icon mb-2"><i class="fa-regular fa-heart"></i></div>
                        <h5 class="font-playfair">No Produce Saved Yet</h5>
                        <p class="text-muted">Bookmark seasonal produce you wish to buy during your next farmers market trip.</p>
                        <a href="produce.html" class="btn btn-fresh btn-sm">
                            <i class="fa-solid fa-apple-whole me-1"></i> Browse Produce Guide
                        </a>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = "";
        produceList.forEach(p => {
            const noteText = notes[`produce_${p.id}`] || "";

            const col = document.createElement("div");
            col.className = "col-lg-6 col-md-12 mb-4";
            col.innerHTML = `
                <div class="bookmark-item-card h-100">
                    <div class="bookmark-card-top d-flex gap-3">
                        <div class="bookmark-img-thumb">
                            <img src="${p.image}" alt="${p.name}">
                        </div>
                        <div class="bookmark-meta-content flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start">
                                <h4 class="bookmark-title mb-1">${p.name}</h4>
                                <button class="btn-remove-bookmark" data-type="produce" data-id="${p.id}" title="Remove Bookmark">
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                            <p class="text-muted mb-1"><span class="badge-produce-mini">${p.category}</span> • Season: <strong>${p.season}</strong></p>
                            <p class="text-muted line-clamp-2 small mb-0">${p.description}</p>
                        </div>
                    </div>

                    <!-- Session Note Section (Requirement 32) -->
                    <div class="session-note-box mt-3 p-3 bg-light rounded">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="note-label"><i class="fa-solid fa-note-sticky text-warning me-1"></i> Session Note:</span>
                            <button class="btn-edit-note btn-link-action" data-key="produce_${p.id}" data-title="${p.name}">
                                <i class="fa-solid ${noteText ? 'fa-pen' : 'fa-plus'} me-1"></i> ${noteText ? 'Edit' : 'Add Note'}
                            </button>
                        </div>
                        <p class="note-text mb-0 ${noteText ? '' : 'text-muted fst-italic'}">
                            ${noteText ? `"${noteText}"` : 'No personal note added yet. Click "Add Note" to write a reminder.'}
                        </p>
                    </div>

                    <div class="bookmark-card-actions mt-3 pt-2 border-top d-flex gap-2">
                        <a href="produce-detail.html?id=${p.id}" class="btn btn-fresh btn-sm flex-grow-1">
                            View Produce Guide <i class="fa-solid fa-arrow-right ms-1"></i>
                        </a>
                        <button class="btn btn-outline-fresh btn-sm" onclick="FreshFindStorage.shareContent('${p.name}', 'Saved seasonal ${p.name}', window.location.origin + '/produce-detail.html?id=${p.id}')" title="Share">
                            <i class="fa-solid fa-share-nodes"></i>
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(col);
        });

        bindBookmarkItemActions(container);
    }

    function bindBookmarkItemActions(container) {
        // Remove bookmark button
        container.querySelectorAll(".btn-remove-bookmark").forEach(btn => {
            btn.onclick = function () {
                const type = btn.getAttribute("data-type");
                const id = btn.getAttribute("data-id");
                if (window.FreshFindStorage) {
                    FreshFindStorage.toggleBookmark(type, id);
                    FreshFindUI.showToast("Bookmark removed.", "info");
                }
            };
        });

        // Edit / Add note button (Requirement 32)
        container.querySelectorAll(".btn-edit-note").forEach(btn => {
            btn.onclick = function () {
                const key = btn.getAttribute("data-key");
                const title = btn.getAttribute("data-title");
                if (window.FreshFindUI) {
                    FreshFindUI.openNoteModal(key, title);
                }
            };
        });
    }

});
