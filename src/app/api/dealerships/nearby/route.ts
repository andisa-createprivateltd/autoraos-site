import { NextResponse } from "next/server";
import { fetchNearbyChineseDealerships, geocodeSouthAfricaLocation } from "@/lib/google-places";
import { haversineKm, searchFallbackDealerships } from "@/lib/geo";
import { hasGooglePlaces } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = checkRateLimit(`nearby:${ip}`, { maxRequests: 60, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many location searches. Please wait and try again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  const { searchParams } = new URL(request.url);
  const latValue = searchParams.get("lat");
  const lngValue = searchParams.get("lng");
  const brand = searchParams.get("brand") || "All";
  const city = searchParams.get("city") || "";
  const locationQuery = searchParams.get("locationQuery") || "";
  const requestedRadius = Number(searchParams.get("radius") || "50000");
  const radius =
    Number.isFinite(requestedRadius) && requestedRadius > 0 ? Math.min(requestedRadius, 100000) : 50000;

  let lat = latValue ? Number(latValue) : undefined;
  let lng = lngValue ? Number(lngValue) : undefined;
  let locationSource: "geolocation" | "geocoded_query" | "none" = "none";
  let resolvedLocation = "";

  if ((latValue && Number.isNaN(lat)) || (lngValue && Number.isNaN(lng))) {
    return NextResponse.json({ message: "Invalid coordinates." }, { status: 400 });
  }

  if (typeof lat === "number" && (lat < -90 || lat > 90)) {
    return NextResponse.json({ message: "Latitude out of range." }, { status: 400 });
  }

  if (typeof lng === "number" && (lng < -180 || lng > 180)) {
    return NextResponse.json({ message: "Longitude out of range." }, { status: 400 });
  }

  if (typeof lat === "number" && typeof lng === "number") {
    locationSource = "geolocation";
  } else if (locationQuery.trim() && hasGooglePlaces()) {
    try {
      const geocoded = await geocodeSouthAfricaLocation(locationQuery);
      if (geocoded) {
        lat = geocoded.lat;
        lng = geocoded.lng;
        resolvedLocation = geocoded.formattedAddress;
        locationSource = "geocoded_query";
      }
    } catch {
      // Falls back below.
    }
  }

  if (typeof lat === "number" && typeof lng === "number" && hasGooglePlaces()) {
    try {
      const liveResults = await fetchNearbyChineseDealerships({
        lat,
        lng,
        radius,
        brand,
        limit: 30
      });

      const filtered = liveResults
        .map((item) => ({
          ...item,
          distanceKm: haversineKm(lat, lng, item.lat, item.lng)
        }))
        .filter((item) => {
          if (!city.trim()) return true;
          const haystack = `${item.city} ${item.address}`.toLowerCase();
          return haystack.includes(city.toLowerCase());
        })
        .sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));

      if (filtered.length > 0) {
        return NextResponse.json({
          source: "google_places",
          usedFallback: false,
          dealerships: filtered,
          locationSource,
          resolvedLocation,
          searchCenter: {
            lat,
            lng
          }
        });
      }
    } catch {
      // Falls back below
    }
  }

  const fallback = searchFallbackDealerships({
    lat,
    lng,
    brand,
    city: city || locationQuery,
    limit: 30
  });

  return NextResponse.json({
    source: "fallback",
    usedFallback: true,
    dealerships: fallback,
    locationSource,
    resolvedLocation,
    searchCenter:
      typeof lat === "number" && typeof lng === "number"
        ? {
            lat,
            lng
          }
        : null
  });
}
