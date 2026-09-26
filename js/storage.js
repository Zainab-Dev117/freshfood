/**
 * FreshFind Storage & Bookmarks System
 * Handles localStorage for bookmarks, sessionStorage for notes, and bookmark exports
 */

const FreshFindStorage = (function () {
    const BOOKMARKS_KEY = "freshfind_bookmarks";
    const NOTES_KEY = "freshfind_session_notes";

    /**
     * Retrieve all saved bookmarks
     * @returns {{ markets: number[], produce: number[] }}
     */
    function getBookmarks() {
        try {
            const raw = localStorage.getItem(BOOKMARKS_KEY);
            if (!raw) return { markets: [], produce: [] };
            const parsed = JSON.parse(raw);
            return {
                markets: Array.isArray(parsed.markets) ? parsed.markets : [],
                produce: Array.isArray(parsed.produce) ? parsed.produce : []
            };
        } catch (e) {
            console.error("Error reading bookmarks from localStorage", e);
            return { markets: [], produce: [] };
        }
    }

    /**
     * Save bookmarks object to localStorage
     */
    function saveBookmarks(data) {
        try {
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(data));
            window.dispatchEvent(new CustomEvent("freshfind_bookmarks_changed", { detail: data }));
        } catch (e) {
            console.error("Error saving bookmarks to localStorage", e);
        }
    }

    /**
     * Checks if an item is bookmarked
     * @param {'market'|'produce'} type 
     * @param {number|string} id 
     */
    function isBookmarked(type, id) {
        const numId = parseInt(id, 10);
        const bookmarks = getBookmarks();
        if (type === "market") {
            return bookmarks.markets.includes(numId);
        }
        if (type === "produce") {
            return bookmarks.produce.includes(numId);
        }
        return false;
    }

    /**
     * Toggles bookmark state for an item
     * @param {'market'|'produce'} type 
     * @param {number|string} id 
     * @returns {boolean} true if now bookmarked, false if removed
     */
    function toggleBookmark(type, id) {
        const numId = parseInt(id, 10);
        const bookmarks = getBookmarks();
        let added = false;

        if (type === "market") {
            const index = bookmarks.markets.indexOf(numId);
            if (index > -1) {
                bookmarks.markets.splice(index, 1);
                added = false;
            } else {
                bookmarks.markets.push(numId);
                added = true;
            }
        } else if (type === "produce") {
            const index = bookmarks.produce.indexOf(numId);
            if (index > -1) {
                bookmarks.produce.splice(index, 1);
                added = false;
            } else {
                bookmarks.produce.push(numId);
                added = true;
            }
        }

        saveBookmarks(bookmarks);
        return added;
    }

    /**
     * Session Notes (Requirement 32)
     * Stored in sessionStorage per session lifecycle
     */
    function getNotes() {
        try {
            const raw = sessionStorage.getItem(NOTES_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    function saveNote(key, noteText) {
        try {
            const notes = getNotes();
            if (!noteText || noteText.trim() === "") {
                delete notes[key];
            } else {
                notes[key] = noteText.trim();
            }
            sessionStorage.setItem(NOTES_KEY, JSON.stringify(notes));
            window.dispatchEvent(new CustomEvent("freshfind_notes_changed", { detail: notes }));
        } catch (e) {
            console.error("Error saving note to sessionStorage", e);
        }
    }

    function getNote(key) {
        const notes = getNotes();
        return notes[key] || "";
    }

    function deleteNote(key) {
        saveNote(key, "");
    }

    /**
     * Export Bookmarks (Requirement 33)
     * Generates a TXT or JSON file and triggers client-side download without a server
     */
    function exportBookmarksFile(allMarkets, allProduce, format = "txt") {
        const bookmarks = getBookmarks();
        const notes = getNotes();

        const savedMarkets = (allMarkets || []).filter(m => bookmarks.markets.includes(m.id));
        const savedProduce = (allProduce || []).filter(p => bookmarks.produce.includes(p.id));

        const now = new Date();
        const dateStr = now.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        if (format === "json") {
            const exportObject = {
                title: "FreshFind Bookmarks & Session Notes",
                exportedAt: now.toISOString(),
                formattedDate: dateStr,
                totalMarkets: savedMarkets.length,
                totalProduce: savedProduce.length,
                markets: savedMarkets.map(m => ({
                    id: m.id,
                    name: m.name,
                    area: m.area,
                    neighborhood: m.neighborhood || "",
                    address: m.address,
                    days: m.days,
                    hours: m.hours,
                    note: notes[`market_${m.id}`] || ""
                })),
                produce: savedProduce.map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    season: p.season,
                    note: notes[`produce_${p.id}`] || ""
                }))
            };

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
            triggerDownload(dataStr, `FreshFind_Bookmarks_${now.toISOString().slice(0, 10)}.json`);
            return;
        }

        // Standard TXT export
        let content = `========================================================\n`;
        content += `FRESHFIND — SAVED BOOKMARKS & NOTES\n`;
        content += `Exported: ${dateStr}\n`;
        content += `Website: FreshFind — Fresh All Along\n`;
        content += `========================================================\n\n`;

        content += `SAVED FARMERS MARKETS (${savedMarkets.length})\n`;
        content += `--------------------------------------------------------\n`;
        if (savedMarkets.length === 0) {
            content += `No markets bookmarked.\n\n`;
        } else {
            savedMarkets.forEach((m, idx) => {
                const note = notes[`market_${m.id}`] || "None";
                content += `${idx + 1}. ${m.name}\n`;
                content += `   Area: ${m.area}${m.neighborhood ? ` (${m.neighborhood})` : ""}\n`;
                content += `   Address: ${m.address}\n`;
                content += `   Operating Days: ${Array.isArray(m.days) ? m.days.join(", ") : m.days}\n`;
                content += `   Hours: ${m.hours}\n`;
                content += `   Session Note: "${note}"\n\n`;
            });
        }

        content += `SAVED FRESH PRODUCE (${savedProduce.length})\n`;
        content += `--------------------------------------------------------\n`;
        if (savedProduce.length === 0) {
            content += `No produce bookmarked.\n\n`;
        } else {
            savedProduce.forEach((p, idx) => {
                const note = notes[`produce_${p.id}`] || "None";
                content += `${idx + 1}. ${p.name}\n`;
                content += `   Category: ${p.category}\n`;
                content += `   Season: ${p.season}\n`;
                content += `   Session Note: "${note}"\n\n`;
            });
        }

        content += `========================================================\n`;
        content += `Generated locally by FreshFind. Support your local markets!\n`;
        content += `========================================================\n`;

        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        triggerDownload(url, `FreshFind_Bookmarks_${now.toISOString().slice(0, 10)}.txt`);
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    }

    function triggerDownload(url, filename) {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    /**
     * Sharing system (Requirement 34)
     * Uses Web Share API if supported, or opens fallback share modal
     */
    function shareContent(title, text, url) {
        const fullUrl = url || window.location.href;
        if (navigator.share) {
            navigator.share({
                title: title || "FreshFind | Local Markets",
                text: text || "Check out this fresh find on FreshFind!",
                url: fullUrl
            }).catch(err => {
                if (err.name !== "AbortError") {
                    openShareModal(title, text, fullUrl);
                }
            });
        } else {
            openShareModal(title, text, fullUrl);
        }
    }

    function openShareModal(title, text, url) {
        const fullUrl = encodeURIComponent(url || window.location.href);
        const fullText = encodeURIComponent(`${title || "FreshFind"} - ${text || "Discover fresh local markets"}`);

        const modal = document.getElementById("freshfindShareModal");
        if (!modal) {
            // Fallback copy to clipboard
            navigator.clipboard.writeText(url || window.location.href).then(() => {
                if (window.FreshFindUI) window.FreshFindUI.showToast("Link copied to clipboard!", "success");
            });
            return;
        }

        const whatsappBtn = document.getElementById("shareWhatsapp");
        const facebookBtn = document.getElementById("shareFacebook");
        const twitterBtn = document.getElementById("shareTwitter");
        const copyBtn = document.getElementById("shareCopyLink");
        const urlInput = document.getElementById("shareUrlInput");

        if (whatsappBtn) whatsappBtn.href = `https://api.whatsapp.com/send?text=${fullText}%20${fullUrl}`;
        if (facebookBtn) facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`;
        if (twitterBtn) twitterBtn.href = `https://twitter.com/intent/tweet?text=${fullText}&url=${fullUrl}`;
        if (urlInput) urlInput.value = url || window.location.href;

        if (copyBtn) {
            copyBtn.onclick = function () {
                navigator.clipboard.writeText(url || window.location.href).then(() => {
                    if (window.FreshFindUI) window.FreshFindUI.showToast("Link copied to clipboard!", "success");
                });
            };
        }

        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    return {
        getBookmarks,
        isBookmarked,
        toggleBookmark,
        getNotes,
        saveNote,
        getNote,
        deleteNote,
        exportBookmarksFile,
        shareContent,
        openShareModal
    };
})();

// Export globally
window.FreshFindStorage = FreshFindStorage;
