"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BRANDS } from "@/lib/constants";

type DealershipItem = {
  id: string;
  name: string;
  brand: string;
  city: string;
  suburb: string;
  province: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  source: "google_places" | "fallback";
  distanceKm?: number;
  mapsUrl?: string;
};

type ApiResult = {
  source: "google_places" | "fallback";
  usedFallback: boolean;
  dealerships: DealershipItem[];
  message?: string;
  locationSource?: "geolocation" | "geocoded_query" | "none";
  resolvedLocation?: string;
  searchCenter?: { lat: number; lng: number } | null;
};

const LAST_COORDS_KEY = "autora-last-geolocation";
const LEGACY_LAST_COORDS_KEY = "createprivate-last-geolocation";

function getCurrentPosition(options: PositionOptions) {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function getGeolocationErrorMessage(error: { code?: number; message?: string }) {
  if (error.code === 1) return "Location permission denied. Use city/suburb search instead.";
  if (error.code === 2) return "Location unavailable. Check GPS/network and try again.";
  if (error.code === 3) return "Location request timed out. Try again or use city/suburb search.";
  return error.message || "Could not get your location.";
}

export function DealershipNearMe() {
  const [brand, setBrand] = useState("All");
  const [city, setCity] = useState("");
  const [radiusKm, setRadiusKm] = useState(50);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<ApiResult | null>(null);
  const [selected, setSelected] = useState<DealershipItem | null>(null);

  const mapCenter = useMemo(() => {
    if (selected) return `${selected.lat},${selected.lng}`;
    if (data?.searchCenter) return `${data.searchCenter.lat},${data.searchCenter.lng}`;
    if (coords) return `${coords.lat},${coords.lng}`;
    return "-26.2041,28.0473";
  }, [selected, data?.searchCenter, coords]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LAST_COORDS_KEY) || window.localStorage.getItem(LEGACY_LAST_COORDS_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as { lat: number; lng: number };
      if (typeof parsed.lat === "number" && typeof parsed.lng === "number") {
        setCoords(parsed);
        setLocationStatus("Using last known location. You can refresh it with 'Use my location'.");
      }
    } catch {
      // Ignore malformed local storage values.
    }
  }, []);

  async function searchDealerships(nextCoords?: { lat: number; lng: number } | null) {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.set("brand", brand);
      params.set("radius", String(radiusKm * 1000));

      const query = city.trim();
      if (query) {
        params.set("city", query);
        params.set("locationQuery", query);
      }

      const activeCoords = nextCoords ?? coords;
      if (activeCoords) {
        params.set("lat", String(activeCoords.lat));
        params.set("lng", String(activeCoords.lng));
      }

      if (!activeCoords && !query) {
        throw new Error("Use your location or enter city/suburb before searching.");
      }

      const response = await fetch(`/api/dealerships/nearby?${params.toString()}`, { cache: "no-store" });
      const result = (await response.json()) as ApiResult & { message?: string };
      if (!response.ok) {
        throw new Error(result.message || "Unable to load dealerships.");
      }

      setData(result);
      setSelected(result.dealerships[0] ?? null);

      if (result.searchCenter) {
        setCoords(result.searchCenter);
      }

      if (result.locationSource === "geocoded_query" && result.resolvedLocation) {
        setLocationStatus(`Search centered on ${result.resolvedLocation}.`);
      } else if (result.locationSource === "geolocation" && activeCoords) {
        setLocationStatus(
          `Using your location (${activeCoords.lat.toFixed(4)}, ${activeCoords.lng.toFixed(4)}), within ${radiusKm} km.`
        );
      } else if (query) {
        setLocationStatus(`Using city/suburb query: ${query}.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dealerships.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleLocate() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setError("");
    setLocationStatus("Detecting your current location...");

    try {
      const precisePosition = await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });

      const next = {
        lat: precisePosition.coords.latitude,
        lng: precisePosition.coords.longitude
      };

      setCoords(next);
      window.localStorage.setItem(LAST_COORDS_KEY, JSON.stringify(next));
      await searchDealerships(next);
      return;
    } catch {
      // Falls back to lower accuracy request.
    }

    try {
      const fastPosition = await getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 7000,
        maximumAge: 5 * 60 * 1000
      });

      const next = {
        lat: fastPosition.coords.latitude,
        lng: fastPosition.coords.longitude
      };

      setCoords(next);
      window.localStorage.setItem(LAST_COORDS_KEY, JSON.stringify(next));
      await searchDealerships(next);
    } catch (geoError) {
      const maybeGeoError = geoError as { code?: number; message?: string };
      setError(getGeolocationErrorMessage(maybeGeoError));
      setLocationStatus("");
    }
  }

  function clearSavedLocation() {
    setCoords(null);
    setLocationStatus("Saved location cleared. Use location again or search by city/suburb.");
    window.localStorage.removeItem(LAST_COORDS_KEY);
    window.localStorage.removeItem(LEGACY_LAST_COORDS_KEY);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-steel/15 bg-white p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.2em] text-tide">Live Search</p>
        <h2 className="mt-2 text-2xl font-semibold text-coal">Chinese Dealerships Near Me</h2>
        <p className="mt-2 text-sm text-steel">
          We use GPS coordinates or geocoded city/suburb queries to search Google Places first, then fallback to the seeded dataset.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_140px_auto_auto]">
          <select value={brand} onChange={(event) => setBrand(event.target.value)} className="input">
            {BRANDS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="input"
            placeholder="City or suburb"
          />

          <select
            value={radiusKm}
            onChange={(event) => setRadiusKm(Number(event.target.value))}
            className="input"
            aria-label="Search radius"
          >
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
            <option value={80}>80 km</option>
          </select>

          <button
            type="button"
            onClick={() => void searchDealerships(null)}
            className="rounded-full bg-coal px-5 py-3 text-sm font-semibold text-white"
          >
            {loading ? "Searching..." : "Search"}
          </button>

          <button
            type="button"
            onClick={() => void handleLocate()}
            className="rounded-full border border-steel/30 px-5 py-3 text-sm font-semibold text-coal"
          >
            Use my location
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {coords ? (
            <>
              <button
                type="button"
                onClick={() => void searchDealerships(coords)}
                className="rounded-full border border-steel/25 px-3 py-1 text-xs font-semibold text-coal"
              >
                Use saved location
              </button>
              <button
                type="button"
                onClick={clearSavedLocation}
                className="rounded-full border border-steel/25 px-3 py-1 text-xs font-semibold text-coal"
              >
                Clear saved location
              </button>
            </>
          ) : null}
          {locationStatus ? <p className="text-xs text-steel">{locationStatus}</p> : null}
        </div>

        {error ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          {data?.dealerships?.length ? (
            data.dealerships.map((dealer) => {
              const bookingHref = `/book?dealership=${encodeURIComponent(dealer.name)}&brand=${encodeURIComponent(
                dealer.brand
              )}&city=${encodeURIComponent(dealer.city)}&province=${encodeURIComponent(dealer.province || "Gauteng")}`;

              return (
                <article
                  key={dealer.id}
                  className="rounded-2xl border border-steel/15 bg-white p-5 shadow-sm"
                  aria-live="polite"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-tide">{dealer.brand}</p>
                      <h3 className="mt-1 text-lg font-semibold text-coal">{dealer.name}</h3>
                    </div>
                    {typeof dealer.distanceKm === "number" ? (
                      <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-steel">
                        {dealer.distanceKm.toFixed(1)} km
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2 text-sm text-steel">{dealer.address}</p>
                  <p className="text-sm text-steel">
                    {dealer.city}
                    {dealer.province ? `, ${dealer.province}` : ""}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={bookingHref} className="rounded-full bg-ember px-4 py-2 text-xs font-semibold text-white">
                      Book an Audit for {dealer.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSelected(dealer)}
                      className="rounded-full border border-steel/25 px-4 py-2 text-xs font-semibold text-coal"
                    >
                      View on map
                    </button>
                    {dealer.mapsUrl ? (
                      <a
                        href={dealer.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-steel/25 px-4 py-2 text-xs font-semibold text-coal"
                      >
                        Open Maps
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-steel/30 bg-white p-6 text-sm text-steel">
              Use your location or search by city/suburb to load nearby Chinese dealerships.
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border border-steel/15 bg-white shadow-soft">
            <iframe
              title="Dealership map"
              src={`https://maps.google.com/maps?q=${mapCenter}&z=11&output=embed`}
              className="h-[280px] w-full sm:h-[320px] md:h-[360px] lg:h-[400px]"
              loading="lazy"
            />
          </div>

          {selected ? (
            <div className="rounded-2xl border border-tide/20 bg-tide/5 p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-tide">Selected Dealership</p>
              <h3 className="mt-1 text-lg font-semibold text-coal">{selected.name}</h3>
              <p className="text-sm text-steel">
                {selected.address} | {selected.city}
              </p>
              <Link
                href={`/book?dealership=${encodeURIComponent(selected.name)}&brand=${encodeURIComponent(
                  selected.brand
                )}&city=${encodeURIComponent(selected.city)}&province=${encodeURIComponent(selected.province || "Gauteng")}`}
                className="mt-4 inline-flex rounded-full bg-ember px-4 py-2 text-xs font-semibold text-white"
              >
                Book an Audit for {selected.name}
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {data?.usedFallback ? (
        <p className="text-xs text-steel">
          Live Google Places data unavailable for this request. Showing seeded dealership dataset fallback.
        </p>
      ) : null}
    </div>
  );
}
