'use client';
import { useEffect, useRef, useState } from 'react';
import { Listing } from '@/lib/types';
import styles from './MapView.module.css';

interface MapViewProps {
    listings: Listing[];
    selectedId: string | null;
    onSelectListing: (id: string) => void;
}

export default function MapView({ listings, selectedId, onSelectListing }: MapViewProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapRef = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const markersRef = useRef<any[]>([]);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (mapRef.current) return;

        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (!token) {
            setMapLoaded(true); // Show fallback
            return;
        }

        import('mapbox-gl').then((mapboxgl) => {
            mapboxgl.default.accessToken = token;

            const map = new mapboxgl.default.Map({
                container: mapContainerRef.current!,
                style: 'mapbox://styles/mapbox/light-v11',
                center: [151.2093, -33.8688],
                zoom: 11,
                attributionControl: false,
            });

            map.on('load', () => {
                setMapLoaded(true);
            });

            mapRef.current = map;
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || !mapLoaded) return;

        import('mapbox-gl').then((mapboxgl) => {
            // Remove existing markers
            markersRef.current.forEach(m => m.remove());
            markersRef.current = [];

            listings.forEach((listing) => {
                const isSelected = listing.id === selectedId;
                const scoreColor = listing.aiScore >= 8 ? '#00C851' : listing.aiScore >= 6 ? '#FFE500' : '#FF3B30';

                // Create a container element for Mapbox to position
                const containerEl = document.createElement('div');
                containerEl.style.zIndex = isSelected ? '10' : '1';
                containerEl.style.cursor = 'pointer';
                containerEl.addEventListener('click', () => onSelectListing(listing.id));

                // Create the actual stylized marker element inside
                const el = document.createElement('div');
                el.className = isSelected ? `${styles.marker} ${styles.markerSelected}` : styles.marker;
                el.style.borderColor = isSelected ? '#0057FF' : '#0D0D0D';
                el.style.background = isSelected ? '#0057FF' : scoreColor;
                el.style.color = isSelected ? '#FFFFFF' : (listing.aiScore >= 6 && listing.aiScore < 8) ? '#0D0D0D' : '#FFFFFF';

                const priceSpan = document.createElement('span');
                // Sanitizing by using textContent rather than innerHTML
                priceSpan.textContent = '$' + listing.pricePerWeek.toString();
                el.appendChild(priceSpan);
                containerEl.appendChild(el);

                const marker = new mapboxgl.default.Marker({ element: containerEl })
                    .setLngLat([listing.lng, listing.lat])
                    .addTo(mapRef.current);

                markersRef.current.push(marker);
            });
        });
    }, [listings, selectedId, mapLoaded, onSelectListing]);

    useEffect(() => {
        if (!mapRef.current || !selectedId || !mapLoaded) return;
        const listing = listings.find(l => l.id === selectedId);
        if (!listing) return;
        mapRef.current.flyTo({
            center: [listing.lng, listing.lat],
            zoom: 14,
            duration: 800,
            essential: true,
        });
    }, [selectedId, listings, mapLoaded]);

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
        return (
            <div className={styles.mapFallback}>
                <div className={styles.mapFallbackInner}>
                    <div className={styles.mapGrid}>
                        {listings.map(listing => (
                            <button
                                key={listing.id}
                                className={`${styles.mapPin} ${selectedId === listing.id ? styles.mapPinSelected : ''}`}
                                onClick={() => onSelectListing(listing.id)}
                                style={{
                                    left: `${((listing.lng - 150.9) / 0.8) * 100}%`,
                                    top: `${((listing.lat + 33.6) / (-34.2 + 33.6)) * -100 + 110}%`,
                                }}
                                title={listing.title}
                            >
                                <span className={styles.pinPrice}>${listing.pricePerWeek}</span>
                            </button>
                        ))}
                    </div>
                    <div className={styles.mapFallbackLabel}>
                        <span>🗺️</span>
                        <p>Add a Mapbox token to enable the interactive map</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.mapContainer}>
            <div ref={mapContainerRef} className={styles.map} />
            {!mapLoaded && (
                <div className={styles.mapLoading}>
                    <div className={styles.spinner} />
                    <span>Loading map...</span>
                </div>
            )}
        </div>
    );
}
