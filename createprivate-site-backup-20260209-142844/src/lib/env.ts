import "server-only";

type ServerEnv = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SENDGRID_API_KEY?: string;
  ADMIN_EMAIL?: string;
  GOOGLE_MAPS_KEY?: string;
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
};

function read(name: keyof ServerEnv) {
  return process.env[name];
}

export const env: ServerEnv = {
  SUPABASE_URL: read("SUPABASE_URL") || "",
  SUPABASE_SERVICE_ROLE_KEY: read("SUPABASE_SERVICE_ROLE_KEY"),
  SENDGRID_API_KEY: read("SENDGRID_API_KEY"),
  ADMIN_EMAIL: read("ADMIN_EMAIL"),
  GOOGLE_MAPS_KEY: read("GOOGLE_MAPS_KEY"),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: read("NEXT_PUBLIC_GA_MEASUREMENT_ID")
};

export function hasSupabase() {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}

export function hasGooglePlaces() {
  return Boolean(env.GOOGLE_MAPS_KEY);
}
