import { ImageResponse } from "next/og";

export const runtime = "edge";
export const revalidate = 300;

const SIZE_MAP = {
  facebook: { width: 1200, height: 630 },
  twitter: { width: 1200, height: 675 },
  linkedin: { width: 1200, height: 627 },
  pinterest: { width: 1000, height: 1500 },
  whatsapp: { width: 800, height: 800 },
  instagram: { width: 1080, height: 1080 },
  tiktok: { width: 1080, height: 1920 },
  default: { width: 1200, height: 630 },
};

async function fetchPoll(origin, id) {
  try {
    const res = await fetch(`${origin}/api/polls/${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.poll) return null;
    const poll = json.poll;
    const options = poll.options || poll.poll_options || [];
    return { ...poll, options };
  } catch {
    return null;
  }
}

export async function GET(req, { params }) {
  const { id } = params || {};
  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;
  const size = url.searchParams.get("size") || "facebook";
  const dims = SIZE_MAP[size] || SIZE_MAP.default;

  let poll = null;
  if (id) {
    poll = await fetchPoll(origin, id);
  }

  const title = poll?.question || poll?.title || "Poll Results";
  const options = Array.isArray(poll?.options) ? poll.options : [];
  const totalVotes = options.reduce((s, o) => s + (o.vote_count || o.votes || 0), 0);
  const left = options[0] || { name: "EVOLVE", vote_count: 0 };
  const right = options[1] || { name: "RESIST", vote_count: 0 };
  const lVotes = left.vote_count || left.votes || 0;
  const rVotes = right.vote_count || right.votes || 0;
  const lPct = totalVotes > 0 ? Math.round((lVotes / totalVotes) * 100) : 50;
  const rPct = totalVotes > 0 ? Math.round((rVotes / totalVotes) * 100) : 50;

  return new ImageResponse(
    <div
      style={{
        width: `${dims.width}px`,
        height: `${dims.height}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
        color: "#fff",
        padding: 60,
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ fontSize: 54, fontWeight: 800, color: "#C2FF02", textAlign: "center", marginBottom: 24 }}>
        {title}
      </div>
      <div style={{ display: "flex", gap: 24, width: "100%", alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 24, color: "#C2FF02", textAlign: "center", marginBottom: 8 }}>
            {(left.name || left.text || "EVOLVE").toString().toUpperCase()}
          </div>
          <div
            style={{
              width: "100%",
              height: 70,
              background: "rgba(26,26,46,0.8)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${lPct}%`,
                height: "100%",
                background: "linear-gradient(90deg, #a8db02, #C2FF02)",
              }}
            />
          </div>
          <div style={{ fontSize: 22, textAlign: "center", marginTop: 10 }}>
            {lPct}% · {lVotes} {lVotes === 1 ? "vote" : "votes"}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 24, color: "#00BFFF", textAlign: "center", marginBottom: 8 }}>
            {(right.name || right.text || "RESIST").toString().toUpperCase()}
          </div>
          <div
            style={{
              width: "100%",
              height: 70,
              background: "rgba(26,26,46,0.8)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${rPct}%`,
                height: "100%",
                background: "linear-gradient(90deg, #6bc5ff, #00BFFF)",
              }}
            />
          </div>
          <div style={{ fontSize: 22, textAlign: "center", marginTop: 10 }}>
            {rPct}% · {rVotes} {rVotes === 1 ? "vote" : "votes"}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 28 }}>Total Votes: {totalVotes}</div>
      <div style={{ fontSize: 26, marginTop: 8, opacity: 0.9 }}>#RESISTOREVOLVE</div>
      <div style={{ fontSize: 24, marginTop: 18, color: "#E5E7EB" }}>SPOREFALL.COM</div>
    </div>,
    {
      width: dims.width,
      height: dims.height,
    },
  );
}
