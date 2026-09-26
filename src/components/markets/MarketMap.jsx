import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function MarketMap({
    latitude,
    longitude,
    title = 'Market Location',
    address = '',
    hours = '',
    height = '350px'
}) {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapContainerRef.current || !latitude || !longitude) return;

        // Clean up any existing map
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        try {
            const map = L.map(mapContainerRef.current, {
                center: [latitude, longitude],
                zoom: 15,
                scrollWheelZoom: false
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const marker = L.marker([latitude, longitude]).addTo(map);
            marker.bindPopup(`
                <div style="font-family: 'DM Sans', sans-serif;">
                    <h6 style="margin: 0 0 4px; font-weight: 700; color: #2C4D3F;">${title}</h6>
                    ${address ? `<p style="margin: 0 0 4px; font-size: 12px; color: #666;">${address}</p>` : ''}
                    ${hours ? `<span style="font-size: 11px; background: #eef1e6; color: #2c4d3f; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${hours}</span>` : ''}
                </div>
            `).openPopup();

            mapInstanceRef.current = map;

            // Invalidate size to ensure proper tile layout
            setTimeout(() => {
                map.invalidateSize();
            }, 250);
        } catch (e) {
            console.error('Error initializing Leaflet map:', e);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [latitude, longitude, title, address, hours]);

    return (
        <div
            ref={mapContainerRef}
            className="market-map-container rounded-4 shadow-sm"
            style={{ width: '100%', height, minHeight: '300px', zIndex: 1 }}
        ></div>
    );
}
