/**
 * FreshFind Contact Page Logic
 * Leaflet map, location detection, and form validation (Requirement 43)
 */

document.addEventListener("DOMContentLoaded", function () {
    if (window.FreshFindUI) {
        FreshFindUI.initGlobalUI("contact");
        FreshFindUI.injectFooter();
    }

    let map = null;
    let userMarker = null;

    // Default Karachi coordinates
    const defaultCoords = [24.8607, 67.0011];

    // Initialize Map
    if (window.L && document.getElementById("contactMap")) {
        map = L.map("contactMap").setView(defaultCoords, 12);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Office marker
        L.marker(defaultCoords)
            .addTo(map)
            .bindPopup(`
                <div style="font-family: 'DM Sans', sans-serif;">
                    <strong style="color: #1F4E38;">FreshFind Community Hub</strong><br>
                    <span>Karachi, Pakistan</span>
                </div>
            `)
            .openPopup();
    }

    // Geolocation detector button (Requirement 43)
    const detectBtn = document.getElementById("btnDetectLocation");
    const statusNote = document.getElementById("contactGeoStatus");

    if (detectBtn) {
        detectBtn.addEventListener("click", function () {
            if (!("geolocation" in navigator)) {
                if (window.FreshFindUI) FreshFindUI.showToast("Geolocation is not supported by your browser.", "warning");
                if (statusNote) statusNote.textContent = "Geolocation is not supported by your browser.";
                return;
            }

            detectBtn.disabled = true;
            detectBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-1"></i> Detecting...`;

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    detectBtn.disabled = false;
                    detectBtn.innerHTML = `<i class="fa-solid fa-location-crosshairs text-success me-1"></i> Location Detected`;

                    if (statusNote) {
                        statusNote.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check me-1"></i> Located your position on the map!</span>`;
                    }

                    if (map) {
                        map.setView([lat, lng], 14);

                        if (userMarker) {
                            userMarker.setLatLng([lat, lng]);
                        } else {
                            userMarker = L.marker([lat, lng])
                                .addTo(map)
                                .bindPopup("<strong>You are here</strong>")
                                .openPopup();
                        }
                    }

                    if (window.FreshFindUI) FreshFindUI.showToast("Your current location is pinned on the map.", "success");
                },
                function (error) {
                    detectBtn.disabled = false;
                    detectBtn.innerHTML = `<i class="fa-solid fa-location-crosshairs me-1"></i> Detect My Location`;

                    // Graceful handling on denial (Requirement 43)
                    const noteText = "Location access was not granted. The page remains fully operational.";
                    if (statusNote) {
                        statusNote.innerHTML = `<span class="text-muted"><i class="fa-solid fa-circle-info me-1"></i> ${noteText}</span>`;
                    }

                    if (window.FreshFindUI) FreshFindUI.showToast(noteText, "info");
                },
                { timeout: 8000 }
            );
        });
    }

    // Form Submission & Validation
    const form = document.getElementById("contactUsForm");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("contactName").value.trim();
            const email = document.getElementById("contactEmail").value.trim();
            const subject = document.getElementById("contactSubject").value.trim();
            const message = document.getElementById("contactMessage").value.trim();

            if (!name || !email || !message) {
                if (window.FreshFindUI) FreshFindUI.showToast("Please fill in all required fields.", "warning");
                return;
            }

            // Valid email check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (window.FreshFindUI) FreshFindUI.showToast("Please enter a valid email address.", "warning");
                return;
            }

            // Success feedback
            if (window.FreshFindUI) {
                FreshFindUI.showToast(`Thank you, ${name}! Your message has been sent successfully.`, "success");
            }

            form.reset();
        });
    }
});
