import { CHINESE_BRANDS } from "@/lib/constants";
import { env } from "@/lib/env";
import type { DealershipResult } from "@/lib/geo";

type PlacesResult = {
  place_id: string;
  name: string;
  vicinity?: string;
  geometry?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
};

type GeocodeResult = {
  formatted_address: string;
  geometry?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
};

type GoogleApiResponse<T> = {
  status: string;
  results: T[];
};

function detectBrand(name: string) {
  const lowered = name.toLowerCase();
  const match = CHINESE_BRANDS.find((brand) => lowered.includes(brand.toLowerCase()));
  return match || null;
}

async function callNearbySearch(params: {
  lat: number;
  lng: number;
  keyword: string;
  radius: number;
}) {
  const { lat, lng, keyword, radius } = params;
  const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
  url.searchParams.set("location", `${lat},${lng}`);
  url.searchParams.set("radius", String(radius));
  url.searchParams.set("keyword", keyword);
  url.searchParams.set("key", env.GOOGLE_MAPS_KEY as string);

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Google Places request failed: ${response.status}`);
  }

  const data = (await response.json()) as GoogleApiResponse<PlacesResult>;
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Google Places status: ${data.status}`);
  }

  return data.results;
}

export async function geocodeSouthAfricaLocation(query: string) {
  if (!env.GOOGLE_MAPS_KEY) {
    throw new Error("GOOGLE_MAPS_KEY is missing.");
  }

  const normalized = query.trim();
  if (!normalized) return null;

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", normalized);
  url.searchParams.set("components", "country:ZA");
  url.searchParams.set("key", env.GOOGLE_MAPS_KEY as string);

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Google Geocode request failed: ${response.status}`);
  }

  const data = (await response.json()) as GoogleApiResponse<GeocodeResult>;
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Google Geocode status: ${data.status}`);
  }

  const result = data.results[0];
  const lat = result?.geometry?.location?.lat;
  const lng = result?.geometry?.location?.lng;

  if (typeof lat !== "number" || typeof lng !== "number") {
    return null;
  }

  return {
    lat,
    lng,
    formattedAddress: result.formatted_address
  };
}

export async function fetchNearbyChineseDealerships(params: {
  lat: number;
  lng: number;
  radius?: number;
  brand?: string;
  limit?: number;
}) {
  if (!env.GOOGLE_MAPS_KEY) {
    throw new Error("GOOGLE_MAPS_KEY is missing.");
  }

  const radius = Math.min(params.radius ?? 50000, 100000);
  const limit = Math.min(params.limit ?? 20, 50);

  const queries =
    params.brand && params.brand !== "All"
      ? [`${params.brand} dealership`]
      : CHINESE_BRANDS.map((brand) => `${brand} dealership`);

  const responses = await Promise.all(
    queries.map((keyword) => callNearbySearch({ lat: params.lat, lng: params.lng, keyword, radius }))
  );

  const merged = new Map<string, DealershipResult>();

  for (const items of responses) {
    for (const item of items) {
      const lat = item.geometry?.location?.lat;
      const lng = item.geometry?.location?.lng;
      if (!lat || !lng) continue;

      const brand = detectBrand(item.name);
      if (params.brand && params.brand !== "All" && brand?.toLowerCase() !== params.brand.toLowerCase()) {
        continue;
      }

      if (!brand) continue;

      merged.set(item.place_id, {
        id: item.place_id,
        name: item.name,
        brand,
        city: item.vicinity || "Unknown",
        suburb: "",
        province: "",
        address: item.vicinity || "Address unavailable",
        phone: "",
        lat,
        lng,
        source: "google_places",
        mapsUrl: `https://www.google.com/maps/place/?q=place_id:${item.place_id}`
      });
    }
  }

  return Array.from(merged.values()).slice(0, limit);
}
