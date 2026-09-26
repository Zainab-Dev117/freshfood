import React, { useState, useEffect } from 'react';

export default function Topbar() {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            const dateStr = now.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            setCurrentTime(`${timeStr} • ${dateStr}`);
        };

        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="freshfind-topbar" id="freshfindTopbar">
            <div className="container d-flex justify-content-between align-items-center py-2">
                <div className="topbar-welcome d-none d-md-flex align-items-center gap-2">
                    <span className="badge-pill-fresh">
                        <i className="fa-solid fa-leaf me-1"></i> Fresh All Along
                    </span>
                    <span className="text-muted-fresh">
                        Local markets, fresh harvests & direct community connections
                    </span>
                </div>
                <div className="topbar-clock ms-auto" id="globalRealtimeClock" title="Live System Time">
                    <i className="fa-regular fa-clock me-1"></i> {currentTime || 'Loading live time...'}
                </div>
            </div>
        </div>
    );
}
