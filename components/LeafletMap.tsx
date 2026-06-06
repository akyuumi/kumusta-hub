"use client";

import { useEffect, useRef } from "react";
import type { LatLngExpression, Map as LeafletMapInstance, Marker } from "leaflet";

export type MapPoint = {
  id: string;
  name: string;
  address?: string;
  href?: string;
  lat: number;
  lng: number;
};

type LeafletMapProps = {
  points: MapPoint[];
  className?: string;
  zoom?: number;
};

export function LeafletMap({ points, className = "h-72", zoom = 14 }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    let isActive = true;

    async function setupMap() {
      const L = await import("leaflet");
      if (!isActive || !containerRef.current) return;

      const validPoints = points.filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));
      const initialCenter: LatLngExpression = validPoints[0] ? [validPoints[0].lat, validPoints[0].lng] : [35.6812, 139.7671];

      const map =
        mapRef.current ??
        L.map(containerRef.current, {
          scrollWheelZoom: false,
          zoomControl: true
        }).setView(initialCenter, zoom);

      if (!mapRef.current) {
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        mapRef.current = map;
      }

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = validPoints.map((point) => {
        const marker = L.marker([point.lat, point.lng]).addTo(map);
        marker.bindPopup(createPopupContent(point));
        return marker;
      });

      if (validPoints.length > 1) {
        map.fitBounds(
          L.latLngBounds(validPoints.map((point) => [point.lat, point.lng] as LatLngExpression)),
          { padding: [28, 28], maxZoom: zoom }
        );
      } else if (validPoints[0]) {
        map.setView([validPoints[0].lat, validPoints[0].lng], zoom);
      }

      window.setTimeout(() => map.invalidateSize(), 0);
    }

    setupMap();

    return () => {
      isActive = false;
    };
  }, [points, zoom]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className={`min-h-64 w-full overflow-hidden rounded-lg ${className}`} aria-label="Store map" />;
}

function createPopupContent(point: MapPoint) {
  const wrapper = document.createElement("div");
  wrapper.className = "space-y-1 text-sm";

  const title = document.createElement(point.href ? "a" : "p");
  title.textContent = point.name;
  title.className = "font-semibold text-ink";
  if (point.href) {
    title.setAttribute("href", point.href);
  }
  wrapper.append(title);

  if (point.address) {
    const address = document.createElement("p");
    address.textContent = point.address;
    address.className = "text-muted";
    wrapper.append(address);
  }

  return wrapper;
}
