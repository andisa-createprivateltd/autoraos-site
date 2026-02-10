import { fallbackDealerships, type Dealership } from "@/data/dealerships";

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export type DealershipResult = Dealership & {
  distanceKm?: number;
  source: "google_places" | "fallback";
  mapsUrl?: string;
};

export function searchFallbackDealerships(params: {
  lat?: number;
  lng?: number;
  brand?: string;
  city?: string;
  limit?: number;
}) {
  const { lat, lng, brand, city, limit = 20 } = params;
  let results = [...fallbackDealerships];

  if (brand && brand !== "All") {
    results = results.filter((item) => item.brand.toLowerCase() === brand.toLowerCase());
  }

  if (city?.trim()) {
    const query = city.trim().toLowerCase();
    results = results.filter((item) => {
      const haystack = `${item.city} ${item.suburb} ${item.address}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  return results
    .map((item) => {
      const distanceKm =
        typeof lat === "number" && typeof lng === "number"
          ? haversineKm(lat, lng, item.lat, item.lng)
          : undefined;

      return {
        ...item,
        source: "fallback" as const,
        distanceKm,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`
      };
    })
    .sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999))
    .slice(0, limit);
}
