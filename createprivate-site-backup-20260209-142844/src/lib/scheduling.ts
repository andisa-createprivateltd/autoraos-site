import { getSupabaseClient } from "@/lib/supabase";

export type AvailabilityWindow = {
  weekday: number;
  start_time: string;
  end_time: string;
  active: boolean;
};

export const DEFAULT_AVAILABILITY: AvailabilityWindow[] = [
  { weekday: 1, start_time: "08:00", end_time: "17:00", active: true },
  { weekday: 2, start_time: "08:00", end_time: "17:00", active: true },
  { weekday: 3, start_time: "08:00", end_time: "17:00", active: true },
  { weekday: 4, start_time: "08:00", end_time: "17:00", active: true },
  { weekday: 5, start_time: "08:00", end_time: "17:00", active: true }
];

const SLOT_MINUTES = 15;
const SAST_OFFSET_MINUTES = 120;

function toSast(date: Date) {
  return new Date(date.getTime() + SAST_OFFSET_MINUTES * 60 * 1000);
}

function fromSast(year: number, month: number, day: number, hour: number, minute: number) {
  return new Date(Date.UTC(year, month - 1, day, hour - 2, minute));
}

function parseTimeToMinutes(value: string) {
  const [hourRaw, minuteRaw] = value.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  return hour * 60 + minute;
}

export async function loadAvailabilityWindows() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("availability_windows")
      .select("weekday,start_time,end_time,active")
      .eq("active", true)
      .order("weekday", { ascending: true })
      .order("start_time", { ascending: true });

    if (error || !data?.length) {
      return DEFAULT_AVAILABILITY;
    }

    return data as AvailabilityWindow[];
  } catch {
    return DEFAULT_AVAILABILITY;
  }
}

export function generateSlots(params: {
  windows: AvailabilityWindow[];
  days?: number;
  minLeadMinutes?: number;
}) {
  const now = new Date();
  const days = params.days ?? 21;
  const minLeadMinutes = params.minLeadMinutes ?? 30;
  const earliest = new Date(now.getTime() + minLeadMinutes * 60 * 1000);

  const windowsByWeekday = new Map<number, AvailabilityWindow[]>();
  for (const window of params.windows.filter((item) => item.active)) {
    const existing = windowsByWeekday.get(window.weekday) || [];
    existing.push(window);
    windowsByWeekday.set(window.weekday, existing);
  }

  const baseSast = toSast(now);
  const slots: string[] = [];

  for (let dayOffset = 0; dayOffset < days; dayOffset += 1) {
    const daySast = new Date(
      Date.UTC(baseSast.getUTCFullYear(), baseSast.getUTCMonth(), baseSast.getUTCDate() + dayOffset, 0, 0, 0)
    );

    const weekday = daySast.getUTCDay();
    const windows = windowsByWeekday.get(weekday) || [];
    if (!windows.length) continue;

    const year = daySast.getUTCFullYear();
    const month = daySast.getUTCMonth() + 1;
    const day = daySast.getUTCDate();

    for (const window of windows) {
      const startMinutes = parseTimeToMinutes(window.start_time);
      const endMinutes = parseTimeToMinutes(window.end_time);

      for (let minute = startMinutes; minute + SLOT_MINUTES <= endMinutes; minute += SLOT_MINUTES) {
        const hour = Math.floor(minute / 60);
        const min = minute % 60;
        const slotUtc = fromSast(year, month, day, hour, min);
        if (slotUtc < earliest) continue;
        slots.push(slotUtc.toISOString());
      }
    }
  }

  return slots;
}

export function isSlotWithinAvailability(slotISO: string, windows: AvailabilityWindow[]) {
  const slotDate = new Date(slotISO);
  if (Number.isNaN(slotDate.getTime())) return false;

  const sast = toSast(slotDate);
  const weekday = sast.getUTCDay();
  const minute = sast.getUTCHours() * 60 + sast.getUTCMinutes();
  if (minute % SLOT_MINUTES !== 0) return false;

  return windows.some((window) => {
    if (!window.active || window.weekday !== weekday) return false;
    const startMinutes = parseTimeToMinutes(window.start_time);
    const endMinutes = parseTimeToMinutes(window.end_time);
    return minute >= startMinutes && minute + SLOT_MINUTES <= endMinutes;
  });
}
