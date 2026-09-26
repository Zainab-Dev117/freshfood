/**
 * FreshFind Core Utility Engine
 * Provides reusable Open/Closed calculations, Geolocation distances, Weekly schedules, and Seasonality.
 */

const DAYS_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Parses time string like "8:00 AM" into minutes from midnight
 */
export function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const clean = timeStr.trim();
    const parts = clean.split(/\s+/);
    if (parts.length < 2) return 0;
    const timeParts = parts[0].split(":");
    let hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1] || "0", 10);
    const ampm = parts[1].toUpperCase();

    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    return hour * 60 + minute;
}

/**
 * Parses operating hours string like "8:00 AM - 2:00 PM"
 */
export function parseOperatingHours(hoursStr) {
    if (!hoursStr) return { open: 480, close: 840, openStr: "8:00 AM", closeStr: "2:00 PM" };
    const parts = hoursStr.split(/\s*-\s*/);
    const openStr = parts[0] || "8:00 AM";
    const closeStr = parts[1] || "2:00 PM";
    return {
        open: parseTimeToMinutes(openStr),
        close: parseTimeToMinutes(closeStr),
        openStr: openStr,
        closeStr: closeStr
    };
}

/**
 * Central Open/Closed Engine (Requirement 41)
 * Calculates status: OPEN, CLOSED, OPENS_SOON, CLOSED_TODAY
 */
export function isMarketOpen(market, nowDate) {
    const now = nowDate || new Date();
    const dayIndex = now.getDay();
    const currentDayName = DAYS_ORDER[dayIndex];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const marketDays = Array.isArray(market.days) ? market.days : [];
    const isScheduledToday = marketDays.includes(currentDayName);
    const hours = parseOperatingHours(market.hours);

    // If today is an operating day
    if (isScheduledToday) {
        // Open now
        if (currentMinutes >= hours.open && currentMinutes <= hours.close) {
            return {
                isOpen: true,
                status: "OPEN",
                label: "OPEN NOW",
                badgeClass: "badge-status-open",
                iconClass: "fa-solid fa-circle-check",
                detail: `Open today until ${hours.closeStr}`
            };
        }

        // Opens soon (within 60 minutes)
        if (currentMinutes < hours.open && (hours.open - currentMinutes) <= 60) {
            const diffMin = hours.open - currentMinutes;
            return {
                isOpen: false,
                status: "OPENS_SOON",
                label: "OPENS SOON",
                badgeClass: "badge-status-soon",
                iconClass: "fa-solid fa-clock",
                detail: `Opens in ${diffMin} min (${hours.openStr})`
            };
        }

        // Already closed today
        if (currentMinutes > hours.close) {
            return {
                isOpen: false,
                status: "CLOSED",
                label: "CLOSED",
                badgeClass: "badge-status-closed",
                iconClass: "fa-solid fa-circle-xmark",
                detail: `Closed for today at ${hours.closeStr}`
            };
        }

        // Early morning before opening window
        return {
            isOpen: false,
            status: "CLOSED",
            label: "CLOSED",
            badgeClass: "badge-status-closed",
            iconClass: "fa-solid fa-clock",
            detail: `Opens today at ${hours.openStr}`
        };
    }

    // Not operating today
    return {
        isOpen: false,
        status: "CLOSED_TODAY",
        label: "CLOSED TODAY",
        badgeClass: "badge-status-closed-today",
        iconClass: "fa-regular fa-calendar-xmark",
        detail: getNextOpenTime(market, now)
    };
}

/**
 * Calculates next operating day and time (Requirement 41)
 */
export function getNextOpenTime(market, nowDate) {
    const now = nowDate || new Date();
    const currentDayIndex = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const hours = parseOperatingHours(market.hours);
    const marketDays = Array.isArray(market.days) ? market.days : [];

    if (marketDays.length === 0) return "Schedule not available";

    const currentDayName = DAYS_ORDER[currentDayIndex];
    if (marketDays.includes(currentDayName) && currentMinutes < hours.open) {
        return `Opens today at ${hours.openStr}`;
    }

    for (let i = 1; i <= 7; i++) {
        const checkIndex = (currentDayIndex + i) % 7;
        const checkDayName = DAYS_ORDER[checkIndex];
        if (marketDays.includes(checkDayName)) {
            if (i === 1) return `Opens tomorrow at ${hours.openStr}`;
            return `Opens ${checkDayName} at ${hours.openStr}`;
        }
    }

    return `Opens ${marketDays[0]} at ${hours.openStr}`;
}

/**
 * Calculates days until next opening (used for sorting)
 */
export function getDaysUntilNextOpen(market, nowDate) {
    const now = nowDate || new Date();
    const currentDayIndex = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const hours = parseOperatingHours(market.hours);
    const marketDays = Array.isArray(market.days) ? market.days : [];

    if (marketDays.length === 0) return 999;

    const currentDayName = DAYS_ORDER[currentDayIndex];
    if (marketDays.includes(currentDayName) && currentMinutes < hours.close) {
        return 0;
    }

    for (let i = 1; i <= 7; i++) {
        const checkIndex = (currentDayIndex + i) % 7;
        const checkDayName = DAYS_ORDER[checkIndex];
        if (marketDays.includes(checkDayName)) {
            return i;
        }
    }
    return 7;
}

/**
 * Generates 7-day schedule with current day highlighted (Requirement 21)
 */
export function getWeeklySchedule(market, nowDate) {
    const now = nowDate || new Date();
    const currentDayIndex = now.getDay();
    const currentDayName = DAYS_ORDER[currentDayIndex];
    const hours = parseOperatingHours(market.hours);
    const marketDays = Array.isArray(market.days) ? market.days : [];
    const displayDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return displayDays.map(dayName => {
        const isOpenDay = marketDays.includes(dayName);
        const isToday = dayName === currentDayName;
        return {
            day: dayName,
            opening: isOpenDay ? hours.openStr : "—",
            closing: isOpenDay ? hours.closeStr : "—",
            status: isOpenDay ? "Open" : "Closed",
            isOpenDay: isOpenDay,
            isToday: isToday
        };
    });
}

/**
 * Haversine Distance Formula in Kilometers (Requirement 13)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 10) / 10;
}

/**
 * Dynamically calculates season from Date (Requirements 6 & 29)
 */
export function getCurrentSeason(nowDate) {
    const now = nowDate || new Date();
    const month = now.getMonth();

    if (month >= 2 && month <= 4) {
        return { id: "Spring", name: "Spring", icon: "fa-seedling", color: "#10b981", emoji: "🌱" };
    }
    if (month >= 5 && month <= 7) {
        return { id: "Summer", name: "Summer", icon: "fa-sun", color: "#f59e0b", emoji: "☀️" };
    }
    if (month >= 8 && month <= 10) {
        return { id: "Fall", name: "Autumn / Fall", icon: "fa-leaf", color: "#d97706", emoji: "🍂" };
    }
    return { id: "Winter", name: "Winter", icon: "fa-snowflake", color: "#0284c7", emoji: "❄️" };
}
