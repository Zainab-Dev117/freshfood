/**
 * FreshFind UI Components & Common Elements
 * Handles Navbar, Real-time Clock, Modals (Login, Signup, Share, Notes), and Toasts
 */

const FreshFindUI = (function () {

    /**
     * Initializes global UI elements across all pages
     */
    function initGlobalUI(activePage = "") {
        injectTopBarAndNavbar(activePage);
        injectModals();
        injectToastContainer();
        initBookmarkBadges();
        initMobileDrawer();

        // Start real-time clock
        if (window.FreshFindEngine) {
            FreshFindEngine.startRealtimeClock("globalRealtimeClock");
        }

        // Listen for bookmark updates
        window.addEventListener("freshfind_bookmarks_changed", function () {
            updateBookmarkBadges();
        });
    }

    /**
     * Injects the top-bar (live clock + greeting) and global navigation bar
     */
    function injectTopBarAndNavbar(activePage) {
        const navContainer = document.getElementById("freshfindGlobalHeader");
        if (!navContainer) return;

        // Path resolution for pages in subdirectories
        const isSubdir = window.location.pathname.includes("/products/");
        const prefix = isSubdir ? "../" : "";

        navContainer.innerHTML = `
            <!-- Top Announcement / Real-time Clock Bar (Requirement 40) -->
            <div class="freshfind-topbar" id="freshfindTopbar">
                <div class="container d-flex justify-content-between align-items-center py-2">
                    <div class="topbar-welcome d-none d-md-flex align-items-center gap-2">
                        <span class="badge-pill-fresh"><i class="fa-solid fa-leaf me-1"></i> Fresh All Along</span>
                        <span class="text-muted-fresh">Local markets, fresh harvests & direct community connections</span>
                    </div>
                    <div class="topbar-clock ms-auto" id="globalRealtimeClock" title="Live System Time">
                        <i class="fa-regular fa-clock me-1"></i> Loading live time...
                    </div>
                </div>
            </div>

            <!-- Global Navbar (Requirement 2) -->
            <nav class="navbar navbar-expand-lg fresh-navbar sticky-top">
                <div class="container">
                    <!-- Logo -->
                    <a class="navbar-brand fresh-logo" href="${prefix}index.html">
                        <div class="logo-icon">
                            <i class="fa-solid fa-basket-shopping"></i>
                            <span class="leaf leaf-1"></span>
                            <span class="leaf leaf-2"></span>
                        </div>
                        <div>
                            <h4>FreshFind</h4>
                            <small>Fresh All Along</small>
                        </div>
                    </a>

                    <!-- Mobile Hamburger (Requirement 2) -->
                    <button class="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar"
                        aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="toggler-icon-bar"></span>
                        <span class="toggler-icon-bar"></span>
                        <span class="toggler-icon-bar"></span>
                    </button>

                    <!-- Navbar Menu -->
                    <div class="collapse navbar-collapse" id="mainNavbar">
                        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <a class="nav-link ${activePage === 'home' ? 'active' : ''}" href="${prefix}index.html">
                                    <i class="fa-solid fa-house me-1"></i> Home
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link ${activePage === 'find' ? 'active' : ''}" href="${prefix}index.html#find-market">
                                    <i class="fa-solid fa-magnifying-glass-location me-1"></i> Find a Market
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link ${activePage === 'directory' ? 'active' : ''}" href="${prefix}market.html">
                                    <i class="fa-solid fa-store me-1"></i> Market Directory
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link ${activePage === 'produce' ? 'active' : ''}" href="${prefix}produce.html">
                                    <i class="fa-solid fa-apple-whole me-1"></i> Produce Guide
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link ${activePage === 'about' ? 'active' : ''}" href="${prefix}about.html">
                                    <i class="fa-solid fa-circle-info me-1"></i> About Us
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link ${activePage === 'contact' ? 'active' : ''}" href="${prefix}contact.html">
                                    <i class="fa-solid fa-paper-plane me-1"></i> Contact Us
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link nav-bookmarks-link ${activePage === 'bookmarks' ? 'active' : ''}" href="${prefix}bookmarks.html">
                                    <i class="fa-solid fa-heart me-1 text-danger"></i> Bookmarks
                                    <span class="bookmarks-count-badge" id="navBookmarksCount">0</span>
                                </a>
                            </li>
                        </ul>

                        <!-- Right Actions -->
                        <div class="navbar-actions d-flex align-items-center gap-2">
                            <button class="btn btn-outline-fresh login-btn-trigger" type="button">
                                <i class="fa-solid fa-arrow-right-to-bracket me-1"></i> Login
                            </button>
                            <button class="btn btn-fresh signup-btn-trigger" type="button">
                                <i class="fa-solid fa-user-plus me-1"></i> Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    /**
     * Injects standard modals: Login, Signup, Share, Session Note
     */
    function injectModals() {
        if (document.getElementById("freshfindModalsContainer")) return;

        const container = document.createElement("div");
        container.id = "freshfindModalsContainer";
        container.innerHTML = `
            <!-- Login Modal (Requirement 44) -->
            <div class="modal fade freshfind-modal" id="freshfindLoginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0 pb-0">
                            <div>
                                <span class="badge-pill-fresh mb-2 d-inline-block">WELCOME BACK</span>
                                <h3 class="modal-title font-playfair" id="loginModalLabel">Login to FreshFind</h3>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body pt-3">
                            <form id="nonFunctionalLoginForm" onsubmit="event.preventDefault(); FreshFindUI.handleLoginSubmit();">
                                <div class="mb-3">
                                    <label for="modalLoginEmail" class="form-label text-dark fw-semibold">Email Address</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
                                        <input type="email" class="form-control" id="modalLoginEmail" placeholder="you@example.com" required>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="modalLoginPassword" class="form-label text-dark fw-semibold">Password</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                                        <input type="password" class="form-control" id="modalLoginPassword" placeholder="••••••••" required>
                                    </div>
                                </div>
                                <div class="d-grid gap-2 mt-4">
                                    <button type="submit" class="btn btn-fresh btn-lg">Login</button>
                                </div>
                            </form>
                            <!-- Required Non-functional Disclaimer Notice (Requirement 44) -->
                            <div class="alert alert-info border-0 mt-3 d-flex align-items-center gap-2 mb-0" role="alert">
                                <i class="fa-solid fa-circle-info fs-5"></i>
                                <small>Login/signup is not part of the current FreshFind implementation. This platform is currently an open community exploration experience.</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Signup Modal (Requirement 45) -->
            <div class="modal fade freshfind-modal" id="freshfindSignupModal" tabindex="-1" aria-labelledby="signupModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0 pb-0">
                            <div>
                                <span class="badge-pill-fresh mb-2 d-inline-block">JOIN OUR COMMUNITY</span>
                                <h3 class="modal-title font-playfair" id="signupModalLabel">Create FreshFind Account</h3>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body pt-3">
                            <form id="nonFunctionalSignupForm" onsubmit="event.preventDefault(); FreshFindUI.handleSignupSubmit();">
                                <div class="mb-3">
                                    <label for="modalSignupName" class="form-label text-dark fw-semibold">Full Name</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                                        <input type="text" class="form-control" id="modalSignupName" placeholder="Zainab Khan" required>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="modalSignupEmail" class="form-label text-dark fw-semibold">Email Address</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
                                        <input type="email" class="form-control" id="modalSignupEmail" placeholder="you@example.com" required>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="modalSignupPassword" class="form-label text-dark fw-semibold">Create Password</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                                        <input type="password" class="form-control" id="modalSignupPassword" placeholder="••••••••" required>
                                    </div>
                                </div>
                                <div class="d-grid gap-2 mt-4">
                                    <button type="submit" class="btn btn-fresh btn-lg">Create Free Account</button>
                                </div>
                            </form>
                            <!-- Required Non-functional Disclaimer Notice (Requirement 45) -->
                            <div class="alert alert-info border-0 mt-3 d-flex align-items-center gap-2 mb-0" role="alert">
                                <i class="fa-solid fa-circle-info fs-5"></i>
                                <small>Login/signup is not part of the current FreshFind implementation. All discovery, bookmarking, and notes features are available freely without an account.</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Share Modal (Requirement 34) -->
            <div class="modal fade freshfind-modal" id="freshfindShareModal" tabindex="-1" aria-labelledby="shareModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0 pb-0">
                            <div>
                                <span class="badge-pill-fresh mb-2 d-inline-block">SPREAD THE WORD</span>
                                <h4 class="modal-title font-playfair" id="shareModalLabel">Share This Fresh Find</h4>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body pt-3">
                            <p class="text-muted mb-3">Share this recommendation with friends, family, and neighbours:</p>
                            <div class="share-buttons-grid mb-4">
                                <a href="#" id="shareWhatsapp" target="_blank" class="share-btn share-whatsapp">
                                    <i class="fa-brands fa-whatsapp"></i> WhatsApp
                                </a>
                                <a href="#" id="shareFacebook" target="_blank" class="share-btn share-facebook">
                                    <i class="fa-brands fa-facebook"></i> Facebook
                                </a>
                                <a href="#" id="shareTwitter" target="_blank" class="share-btn share-twitter">
                                    <i class="fa-brands fa-x-twitter"></i> X / Twitter
                                </a>
                            </div>
                            <label class="form-label text-dark fw-semibold">Or Copy Page Link:</label>
                            <div class="input-group">
                                <input type="text" id="shareUrlInput" class="form-control" readonly>
                                <button class="btn btn-fresh" id="shareCopyLink" type="button">
                                    <i class="fa-solid fa-copy me-1"></i> Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Session Note Modal (Requirement 32) -->
            <div class="modal fade freshfind-modal" id="freshfindNoteModal" tabindex="-1" aria-labelledby="noteModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header border-0 pb-0">
                            <div>
                                <span class="badge-pill-fresh mb-2 d-inline-block">SESSION NOTE</span>
                                <h4 class="modal-title font-playfair" id="noteModalLabel">Add Personal Note</h4>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body pt-3">
                            <input type="hidden" id="noteItemKey" value="">
                            <div class="mb-3">
                                <label for="noteInputText" class="form-label text-dark fw-semibold" id="noteItemTitle">Note content:</label>
                                <textarea id="noteInputText" class="form-control" rows="4" placeholder="e.g., Visit Saturday morning early to get fresh strawberries and artisan cheese."></textarea>
                                <small class="text-muted mt-1 d-block"><i class="fa-regular fa-clock me-1"></i> Notes are preserved during your active browser session.</small>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mt-4">
                                <button type="button" class="btn btn-outline-danger btn-sm" id="btnDeleteNote" style="display:none;">
                                    <i class="fa-solid fa-trash-can me-1"></i> Delete Note
                                </button>
                                <div class="ms-auto d-flex gap-2">
                                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                                    <button type="button" class="btn btn-fresh" id="btnSaveNote">Save Note</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // Bind login & signup triggers
        document.addEventListener("click", function (e) {
            const loginTrigger = e.target.closest(".login-btn-trigger, .login-btn");
            if (loginTrigger) {
                e.preventDefault();
                const modal = new bootstrap.Modal(document.getElementById("freshfindLoginModal"));
                modal.show();
                return;
            }

            const signupTrigger = e.target.closest(".signup-btn-trigger, .signup-btn");
            if (signupTrigger) {
                e.preventDefault();
                const modal = new bootstrap.Modal(document.getElementById("freshfindSignupModal"));
                modal.show();
                return;
            }
        });

        // Note save handler
        const saveNoteBtn = document.getElementById("btnSaveNote");
        if (saveNoteBtn) {
            saveNoteBtn.onclick = function () {
                const key = document.getElementById("noteItemKey").value;
                const text = document.getElementById("noteInputText").value;
                if (window.FreshFindStorage) {
                    FreshFindStorage.saveNote(key, text);
                    showToast(text ? "Note saved for this session!" : "Note removed.", "success");
                }
                const modalEl = document.getElementById("freshfindNoteModal");
                const bsModal = bootstrap.Modal.getInstance(modalEl);
                if (bsModal) bsModal.hide();
            };
        }

        // Note delete handler
        const deleteNoteBtn = document.getElementById("btnDeleteNote");
        if (deleteNoteBtn) {
            deleteNoteBtn.onclick = function () {
                const key = document.getElementById("noteItemKey").value;
                if (window.FreshFindStorage) {
                    FreshFindStorage.deleteNote(key);
                    showToast("Note deleted.", "info");
                }
                const modalEl = document.getElementById("freshfindNoteModal");
                const bsModal = bootstrap.Modal.getInstance(modalEl);
                if (bsModal) bsModal.hide();
            };
        }
    }

    /**
     * Toast notification container and helper (Requirement 47)
     */
    function injectToastContainer() {
        if (document.getElementById("freshfindToastContainer")) return;
        const container = document.createElement("div");
        container.id = "freshfindToastContainer";
        container.className = "toast-container position-fixed bottom-0 end-0 p-3";
        container.style.zIndex = "1100";
        document.body.appendChild(container);
    }

    function showToast(message, type = "success") {
        const container = document.getElementById("freshfindToastContainer");
        if (!container) return;

        const icons = {
            success: "fa-solid fa-circle-check text-success",
            info: "fa-solid fa-circle-info text-primary",
            warning: "fa-solid fa-triangle-exclamation text-warning",
            danger: "fa-solid fa-circle-xmark text-danger"
        };

        const toastId = "toast_" + Date.now();
        const toastEl = document.createElement("div");
        toastEl.className = "toast align-items-center border-0 shadow-lg text-dark bg-white custom-toast";
        toastEl.id = toastId;
        toastEl.setAttribute("role", "alert");
        toastEl.setAttribute("aria-live", "assertive");
        toastEl.setAttribute("aria-atomic", "true");

        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body d-flex align-items-center gap-2">
                    <i class="${icons[type] || icons.info} fs-5"></i>
                    <div>${message}</div>
                </div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        container.appendChild(toastEl);
        const bsToast = new bootstrap.Toast(toastEl, { delay: 3500 });
        bsToast.show();

        toastEl.addEventListener("hidden.bs.toast", function () {
            toastEl.remove();
        });
    }

    function handleLoginSubmit() {
        showToast("Login/signup is not part of the current FreshFind implementation.", "info");
        const modalEl = document.getElementById("freshfindLoginModal");
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
    }

    function handleSignupSubmit() {
        showToast("Login/signup is not part of the current FreshFind implementation.", "info");
        const modalEl = document.getElementById("freshfindSignupModal");
        const bsModal = bootstrap.Modal.getInstance(modalEl);
        if (bsModal) bsModal.hide();
    }

    /**
     * Updates bookmark count badges
     */
    function updateBookmarkBadges() {
        if (!window.FreshFindStorage) return;
        const bookmarks = FreshFindStorage.getBookmarks();
        const total = (bookmarks.markets ? bookmarks.markets.length : 0) + (bookmarks.produce ? bookmarks.produce.length : 0);

        const badges = document.querySelectorAll("#navBookmarksCount, .bookmarks-badge-total");
        badges.forEach(b => {
            b.textContent = total;
            b.style.display = total > 0 ? "inline-flex" : "none";
        });
    }

    function initBookmarkBadges() {
        updateBookmarkBadges();
    }

    function initMobileDrawer() {
        // Toggle animation and accessibility
        const toggler = document.querySelector(".navbar-toggler");
        if (toggler) {
            toggler.addEventListener("click", function () {
                toggler.classList.toggle("open");
            });
        }
    }

    /**
     * Opens Note editor modal for an item
     */
    function openNoteModal(key, title) {
        const modalEl = document.getElementById("freshfindNoteModal");
        if (!modalEl || !window.FreshFindStorage) return;

        const currentNote = FreshFindStorage.getNote(key);
        document.getElementById("noteItemKey").value = key;
        document.getElementById("noteItemTitle").textContent = `Note for: ${title}`;
        document.getElementById("noteInputText").value = currentNote;

        const deleteBtn = document.getElementById("btnDeleteNote");
        if (deleteBtn) {
            deleteBtn.style.display = currentNote ? "inline-block" : "none";
        }

        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }

    /**
     * Standard Footer Rendering (Requirement 46)
     */
    function injectFooter() {
        const footerContainer = document.getElementById("freshfindGlobalFooter");
        if (!footerContainer) return;

        const isSubdir = window.location.pathname.includes("/products/");
        const prefix = isSubdir ? "../" : "";

        footerContainer.innerHTML = `
            <footer class="site-footer">
                <div class="footer-wrapper">
                    <!-- Brand Section -->
                    <div class="footer-brand-col">
                        <a href="${prefix}index.html" class="footer-logo">
                            <div class="d-flex align-items-center gap-2">
                                <div class="logo-icon logo-icon-light">
                                    <i class="fa-solid fa-basket-shopping text-white"></i>
                                </div>
                                <h3 class="text-white font-playfair mb-0">FreshFind</h3>
                            </div>
                        </a>
                        <p class="footer-tagline">Fresh Finds. Local Markets. Better Choices.</p>
                        <p class="footer-desc">Supporting regional growers, artisan producers, and vibrant neighborhood farmers markets.</p>
                    </div>

                    <!-- Navigation Links -->
                    <div class="footer-links-col">
                        <h5>Explore</h5>
                        <ul class="footer-nav-list">
                            <li><a href="${prefix}index.html">Home</a></li>
                            <li><a href="${prefix}index.html#find-market">Find a Market</a></li>
                            <li><a href="${prefix}market.html">Market Directory</a></li>
                            <li><a href="${prefix}produce.html">Produce Guide</a></li>
                            <li><a href="${prefix}bookmarks.html">My Bookmarks</a></li>
                        </ul>
                    </div>

                    <!-- Quick Links & Project Info -->
                    <div class="footer-links-col">
                        <h5>Information</h5>
                        <ul class="footer-nav-list">
                            <li><a href="${prefix}about.html">About FreshFind</a></li>
                            <li><a href="${prefix}contact.html">Contact Us</a></li>
                            <li><a href="${prefix}about.html#team">Our Team</a></li>
                            <li><a href="${prefix}index.html#seasonal-picks">Seasonal Picks</a></li>
                            <li><span class="footer-status-pill"><i class="fa-solid fa-circle-check text-success me-1"></i> Frontend Project</span></li>
                        </ul>
                    </div>

                    <!-- Social & Contact -->
                    <div class="footer-social-col">
                        <h5>Stay Connected</h5>
                        <div class="footer-socials">
                            <a href="https://instagram.com" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                            <a href="https://facebook.com" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
                            <a href="https://twitter.com" target="_blank" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
                            <a href="https://whatsapp.com" target="_blank" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
                        </div>
                        <p class="footer-contact-item mt-3"><i class="fa-solid fa-envelope me-2"></i> hello@freshfind.com</p>
                        <p class="footer-contact-item"><i class="fa-solid fa-location-dot me-2"></i> Karachi, Pakistan</p>
                    </div>
                </div>

                <div class="footer-bottom-bar">
                    <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center py-3">
                        <small>© 2026 FreshFind — Fresh All Along. All rights reserved.</small>
                        <small class="text-white-50">Designed with passion for local communities.</small>
                    </div>
                </div>
            </footer>
        `;
    }

    return {
        initGlobalUI,
        injectFooter,
        showToast,
        openNoteModal,
        updateBookmarkBadges,
        handleLoginSubmit,
        handleSignupSubmit
    };
})();

// Export globally
window.FreshFindUI = FreshFindUI;
