import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const hasDb = Boolean(url && serviceRoleKey);
const client = hasDb
  ? createClient(url as string, serviceRoleKey as string, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : null;

async function cleanup(ids: { groups: string[]; dealers: string[]; leads: string[]; conversations: string[]; messages: string[]; bookings: string[]; policies: string[] }) {
  if (!client) return;
  if (ids.bookings.length) await client.from("autora_bookings").delete().in("id", ids.bookings);
  if (ids.messages.length) await client.from("autora_messages").delete().in("id", ids.messages);
  if (ids.conversations.length) await client.from("autora_conversations").delete().in("id", ids.conversations);
  if (ids.leads.length) await client.from("autora_leads").delete().in("id", ids.leads);
  if (ids.policies.length) await client.from("autora_sla_policies").delete().in("id", ids.policies);
  if (ids.dealers.length) await client.from("autora_dealerships").delete().in("id", ids.dealers);
  if (ids.groups.length) await client.from("autora_groups").delete().in("id", ids.groups);
}

test("autora_compute_due_at respects policy and after-hours mode", { skip: !hasDb }, async () => {
  assert.ok(client);
  const ids = {
    groups: [randomUUID()],
    dealers: [randomUUID()],
    leads: [] as string[],
    conversations: [] as string[],
    messages: [] as string[],
    bookings: [] as string[],
    policies: [randomUUID()]
  };

  try {
    await client.from("autora_groups").insert({ id: ids.groups[0], name: "AUTORA Test Group", timezone: "Africa/Johannesburg" });
    await client.from("autora_dealerships").insert({ id: ids.dealers[0], group_id: ids.groups[0], name: "AUTORA Test Dealer", city: "Roodepoort" });
    await client.from("autora_sla_policies").insert({
      id: ids.policies[0],
      group_id: ids.groups[0],
      dealership_id: ids.dealers[0],
      name: "Test SLA",
      priority: 10,
      response_seconds_hot: 120,
      response_seconds_warm: 600,
      response_seconds_cold: 1200,
      after_hours_mode: "next_open"
    });

    const { data, error } = await client.rpc("autora_compute_due_at", {
      p_group_id: ids.groups[0],
      p_dealership_id: ids.dealers[0],
      p_inbound_at: "2026-03-02T19:00:00+02:00",
      p_temperature: "hot"
    });

    assert.ifError(error);
    assert.equal(new Date(data as string).getHours(), 8);
    assert.equal(new Date(data as string).getMinutes(), 15);
  } finally {
    await cleanup(ids);
  }
});

test("inbound and outbound messages create and satisfy sla events deterministically", { skip: !hasDb }, async () => {
  assert.ok(client);
  const ids = {
    groups: [randomUUID()],
    dealers: [randomUUID()],
    leads: [randomUUID()],
    conversations: [randomUUID()],
    messages: [randomUUID(), randomUUID()],
    bookings: [] as string[],
    policies: [randomUUID()]
  };

  try {
    await client.from("autora_groups").insert({ id: ids.groups[0], name: "AUTORA Test Group", timezone: "Africa/Johannesburg" });
    await client.from("autora_dealerships").insert({ id: ids.dealers[0], group_id: ids.groups[0], name: "AUTORA Test Dealer", city: "Roodepoort" });
    await client.from("autora_sla_policies").insert({
      id: ids.policies[0],
      group_id: ids.groups[0],
      dealership_id: ids.dealers[0],
      name: "Test SLA",
      priority: 10,
      response_seconds_hot: 120,
      response_seconds_warm: 300,
      response_seconds_cold: 600,
      after_hours_mode: "allow_overdue"
    });
    await client.from("autora_leads").insert({
      id: ids.leads[0],
      group_id: ids.groups[0],
      dealership_id: ids.dealers[0],
      full_name: "Khumo Test",
      phone: "+27700000001",
      vehicle_interest: "JAECOO J7 SHS",
      source: "whatsapp",
      temperature: "hot",
      status: "contacted"
    });
    await client.from("autora_conversations").insert({
      id: ids.conversations[0],
      lead_id: ids.leads[0],
      group_id: ids.groups[0],
      dealership_id: ids.dealers[0],
      channel: "whatsapp"
    });

    const inbound = await client.from("autora_messages").insert({
      id: ids.messages[0],
      conversation_id: ids.conversations[0],
      direction: "inbound",
      body: "Need a test drive this week.",
      created_at: new Date().toISOString()
    });
    assert.ifError(inbound.error);

    const conversationAfterInbound = await client
      .from("autora_conversations")
      .select("response_due_at,is_overdue,last_inbound_at")
      .eq("id", ids.conversations[0])
      .single();
    assert.ifError(conversationAfterInbound.error);
    assert.ok(conversationAfterInbound.data.response_due_at);
    assert.equal(conversationAfterInbound.data.is_overdue, false);

    const eventAfterInbound = await client
      .from("autora_sla_events")
      .select("id,satisfied_at,breached_at")
      .eq("conversation_id", ids.conversations[0])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    assert.ifError(eventAfterInbound.error);
    assert.equal(eventAfterInbound.data.satisfied_at, null);

    const outbound = await client.from("autora_messages").insert({
      id: ids.messages[1],
      conversation_id: ids.conversations[0],
      direction: "outbound",
      body: "We have availability tomorrow at 10:00.",
      created_at: new Date().toISOString()
    });
    assert.ifError(outbound.error);

    const eventAfterOutbound = await client
      .from("autora_sla_events")
      .select("id,satisfied_at")
      .eq("conversation_id", ids.conversations[0])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    assert.ifError(eventAfterOutbound.error);
    assert.ok(eventAfterOutbound.data.satisfied_at);
  } finally {
    await cleanup(ids);
  }
});

test("sla enforcer marks overdue and breached rows and dashboard snapshot reconciles", { skip: !hasDb }, async () => {
  assert.ok(client);
  const ids = {
    groups: [randomUUID()],
    dealers: [randomUUID()],
    leads: [randomUUID()],
    conversations: [randomUUID()],
    messages: [randomUUID()],
    bookings: [] as string[],
    policies: [randomUUID()]
  };

  try {
    await client.from("autora_groups").insert({ id: ids.groups[0], name: "AUTORA Test Group", timezone: "Africa/Johannesburg" });
    await client.from("autora_dealerships").insert({ id: ids.dealers[0], group_id: ids.groups[0], name: "AUTORA Test Dealer", city: "Roodepoort" });
    await client.from("autora_sla_policies").insert({
      id: ids.policies[0],
      group_id: ids.groups[0],
      dealership_id: ids.dealers[0],
      name: "Test SLA",
      priority: 10,
      response_seconds_hot: 60,
      response_seconds_warm: 60,
      response_seconds_cold: 60,
      after_hours_mode: "allow_overdue"
    });
    await client.from("autora_leads").insert({
      id: ids.leads[0],
      group_id: ids.groups[0],
      dealership_id: ids.dealers[0],
      full_name: "Ayesha Test",
      phone: "+27700000002",
      vehicle_interest: "OMODA C9",
      source: "ads",
      temperature: "hot",
      status: "contacted",
      estimated_value: 785000,
      close_probability: 0.26,
      created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    });
    await client.from("autora_conversations").insert({
      id: ids.conversations[0],
      lead_id: ids.leads[0],
      group_id: ids.groups[0],
      dealership_id: ids.dealers[0],
      channel: "whatsapp",
      created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    });
    await client.from("autora_messages").insert({
      id: ids.messages[0],
      conversation_id: ids.conversations[0],
      direction: "inbound",
      body: "Can I book a drive today?",
      created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    });

    const enforcer = await client.rpc("autora_run_sla_enforcer");
    assert.ifError(enforcer.error);

    const breached = await client
      .from("autora_sla_events")
      .select("breached_at,satisfied_at")
      .eq("conversation_id", ids.conversations[0])
      .single();
    assert.ifError(breached.error);
    assert.ok(breached.data.breached_at);
    assert.equal(breached.data.satisfied_at, null);

    const snapshot = await client.rpc("autora_dashboard_snapshot", {
      p_window: "7d",
      p_dealership_id: ids.dealers[0],
      p_group_id: null,
      p_dealership_ids: [ids.dealers[0]],
      p_start: null,
      p_end: null
    });
    assert.ifError(snapshot.error);
    const payload = snapshot.data as Record<string, unknown>;
    assert.ok(Number(payload.revenue_at_risk) > 0);
    assert.ok(Number(payload.sla_breaches_total) > 0);
    assert.ok(Array.isArray(payload.recover_now));
  } finally {
    await cleanup(ids);
  }
});

test("recover queue excludes breaches older than 48 hours by default", { skip: !hasDb }, async () => {
  assert.ok(client);
  const ids = {
    groups: [randomUUID()],
    dealers: [randomUUID()],
    leads: [randomUUID()],
    conversations: [randomUUID()],
    messages: [] as string[],
    bookings: [] as string[],
    policies: [] as string[]
  };

  try {
    await client.from("autora_groups").insert({ id: ids.groups[0], name: "AUTORA Queue Group", timezone: "Africa/Johannesburg" });
    await client.from("autora_dealerships").insert({ id: ids.dealers[0], group_id: ids.groups[0], name: "AUTORA Queue Dealer", city: "Roodepoort" });
    await client.from("autora_leads").insert({
      id: ids.leads[0],
      group_id: ids.groups[0],
      dealership_id: ids.dealers[0],
      full_name: "Legacy Breach",
      phone: "+27700000003",
      vehicle_interest: "OMODA C5",
      source: "website",
      temperature: "hot",
      status: "contacted",
      estimated_value: 420000,
      close_probability: 0.22,
      created_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString()
    });
    await client.from("autora_conversations").insert({
      id: ids.conversations[0],
      lead_id: ids.leads[0],
      group_id: ids.groups[0],
      dealership_id: ids.dealers[0],
      channel: "whatsapp",
      response_due_at: new Date(Date.now() - 95 * 60 * 60 * 1000).toISOString(),
      is_overdue: true,
      created_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString()
    });
    const staleEventId = randomUUID();
    await client.from("autora_sla_events").insert({
      id: staleEventId,
      group_id: ids.groups[0],
      dealership_id: ids.dealers[0],
      lead_id: ids.leads[0],
      conversation_id: ids.conversations[0],
      temperature: "hot",
      due_at: new Date(Date.now() - 95 * 60 * 60 * 1000).toISOString(),
      breached_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString()
    });

    const queue = await client.rpc("v_recover_now_queue", {
      p_dealership_id: ids.dealers[0],
      p_group_id: null,
      p_dealership_ids: [ids.dealers[0]],
      p_include_all_time: false
    });

    assert.ifError(queue.error);
    const rows = (queue.data || []) as Array<{ sla_event_id: string }>;
    assert.equal(rows.some((row) => row.sla_event_id === staleEventId), false);
  } finally {
    await cleanup(ids);
  }
});
