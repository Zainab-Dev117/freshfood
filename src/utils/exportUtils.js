/**
 * Client-Side Bookmarks Exporter (Requirement 33)
 * Generates formatted TXT or JSON files and downloads them directly in browser without server.
 */

export function exportBookmarks(markets, produce, notes, format = "txt") {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    if (format === "json") {
        const exportObj = {
            title: "FreshFind Bookmarks & Session Notes",
            exportedAt: now.toISOString(),
            formattedDate: dateStr,
            totalMarkets: markets.length,
            totalProduce: produce.length,
            markets: markets.map(m => ({
                id: m.id,
                name: m.name,
                area: m.area,
                neighborhood: m.neighborhood || "",
                address: m.address,
                days: m.days,
                hours: m.hours,
                note: notes[`market_${m.id}`] || ""
            })),
            produce: produce.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category,
                season: p.season,
                note: notes[`produce_${p.id}`] || ""
            }))
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
        triggerDownload(dataStr, `FreshFind_Bookmarks_${now.toISOString().slice(0, 10)}.json`);
        return;
    }

    // Default TXT Format
    let content = `========================================================\n`;
    content += `FRESHFIND — SAVED BOOKMARKS & NOTES\n`;
    content += `Exported: ${dateStr}\n`;
    content += `Website: FreshFind — Fresh All Along\n`;
    content += `========================================================\n\n`;

    content += `SAVED FARMERS MARKETS (${markets.length})\n`;
    content += `--------------------------------------------------------\n`;
    if (markets.length === 0) {
        content += `No markets bookmarked.\n\n`;
    } else {
        markets.forEach((m, idx) => {
            const note = notes[`market_${m.id}`] || "None";
            content += `${idx + 1}. ${m.name}\n`;
            content += `   Area: ${m.area}${m.neighborhood ? ` (${m.neighborhood})` : ""}\n`;
            content += `   Address: ${m.address}\n`;
            content += `   Operating Days: ${Array.isArray(m.days) ? m.days.join(", ") : m.days}\n`;
            content += `   Hours: ${m.hours}\n`;
            content += `   Session Note: "${note}"\n\n`;
        });
    }

    content += `SAVED FRESH PRODUCE (${produce.length})\n`;
    content += `--------------------------------------------------------\n`;
    if (produce.length === 0) {
        content += `No produce bookmarked.\n\n`;
    } else {
        produce.forEach((p, idx) => {
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

export const exportBookmarksFile = (allMarkets, allProducts, format = "txt", notes = {}) => {
    // Also supports signature (markets, products, format) or (markets, produce, notes, format)
    if (typeof format === 'object' && format !== null) {
        return exportBookmarks(allMarkets, allProducts, format, "txt");
    }
    return exportBookmarks(allMarkets, allProducts, notes, format);
};
