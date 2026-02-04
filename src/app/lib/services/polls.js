import { getBaseUrl } from "./base";

function toMs(v) {
  return v ? new Date(v).getTime() : 0;
}

function isLiveNotEnded(p, nowMs) {
  const statusLive = String(p.status || "").toUpperCase() === "LIVE";
  let endsMs = null;
  if (p.ends_at) {
    endsMs = new Date(p.ends_at).getTime();
  } else if (p.starts_at && p.duration_days) {
    endsMs = new Date(p.starts_at).getTime() + p.duration_days * 24 * 60 * 60 * 1000;
  }
  const isClosed = !statusLive || (endsMs && nowMs >= endsMs);
  return !isClosed;
}

function normalizePoll(p) {
  const options = p.poll_options || p.options || [];
  return {
    ...p,
    options,
    id: p.id,
    episodeId: p.episode_id || p.episodeId,
    title: p.title || p.question || "Poll",
    question: p.question || p.title || "Make your choice",
    description: p.description || p.question || "Make your choice",
    status: p.status || "LIVE",
    starts_at: p.starts_at,
    ends_at: p.ends_at,
    duration_days: p.duration_days,
    created_at: p.created_at,
  };
}

function sortByRecency(a, b) {
  const byStart = toMs(b.starts_at) - toMs(a.starts_at);
  if (byStart !== 0) return byStart;
  const byCreated = toMs(b.created_at) - toMs(a.created_at);
  if (byCreated !== 0) return byCreated;
  return toMs(b.ends_at) - toMs(a.ends_at);
}

export async function getPolls({ status, limit } = {}) {
  try {
    const base = getBaseUrl();
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (limit) params.set("limit", String(limit));
    const res = await fetch(`${base}/api/polls?${params.toString()}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    const list = json.polls || [];
    return list.map(normalizePoll);
  } catch {
    return [];
  }
}

export async function getLiveNotEndedPolls() {
  const all = await getPolls();
  const nowMs = Date.now();
  return all.filter((p) => isLiveNotEnded(p, nowMs)).sort(sortByRecency);
}

export async function getLatestLiveNotEndedPoll() {
  const list = await getLiveNotEndedPolls();
  return list[0] || null;
}
