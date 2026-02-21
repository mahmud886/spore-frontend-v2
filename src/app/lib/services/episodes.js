import { getBaseUrl } from "./base";

export async function getEpisodes({ limit = 100, offset = 0, visibility, accessLevel, status } = {}) {
  try {
    const base = getBaseUrl();
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    params.set("offset", String(offset));
    if (visibility) params.set("visibility", visibility);
    if (accessLevel) params.set("access_level", accessLevel);
    if (status) params.set("status", status);
    const res = await fetch(`${base}/api/episodes?${params.toString()}`, { next: { revalidate: 360 } });
    if (!res.ok) return [];
    const json = await res.json();
    const data = json.episodes || [];
    return data.map((episode) => {
      let s = "locked";
      if (episode.visibility === "AVAILABLE") s = "available";
      else if (episode.visibility === "UPCOMING" || episode.visibility === "COMING_SOON") s = "upcoming";
      else if (episode.visibility === "LOCKED" || episode.visibility === "PRIVATE") s = "locked";
      return {
        id: episode.id || episode._id,
        title:
          episode.title || `Episode ${episode.episode_number || episode.episodeNumber || ""} : ${episode.name || ""}`,
        description: episode.description || episode.summary || "",
        thumbnail:
          episode.thumb_image_url ||
          episode.thumbnail ||
          episode.image ||
          episode.coverImage ||
          episode.banner_image_url ||
          "/assets/images/episodes/default.png",
        status: s,
        runtime: episode.runtime || episode.duration || "40:15 m",
        episodeNumber: episode.episode_number || episode.episodeNumber,
        seasonNumber: episode.season_number || episode.seasonNumber,
        uniqueEpisodeId: episode.unique_episode_id || episode.uniqueEpisodeId,
        videoUrl: episode.video_url || episode.videoUrl,
        releaseDate: episode.release_datetime || episode.releaseDate,
      };
    });
  } catch {
    return [];
  }
}

export async function getEpisodeById(id) {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/episodes/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    const episode = json.episode;

    if (!episode) return null;

    let s = "locked";
    if (episode.visibility === "AVAILABLE") s = "available";
    else if (episode.visibility === "UPCOMING" || episode.visibility === "COMING_SOON") s = "upcoming";
    else if (episode.visibility === "LOCKED" || episode.visibility === "PRIVATE") s = "locked";

    return {
      id: episode.id || episode._id,
      title: episode.title || `Episode ${episode.episode_number || ""} : ${episode.name || ""}`,
      description: episode.description || episode.summary || "",
      thumbnail:
        episode.thumb_image_url ||
        episode.thumbnail ||
        episode.image ||
        episode.coverImage ||
        episode.banner_image_url ||
        "/assets/images/episodes/default.png",
      status: s,
      runtime: episode.runtime || episode.duration || "40:15 m",
      episodeNumber: episode.episode_number || episode.episodeNumber,
      seasonNumber: episode.season_number || episode.seasonNumber,
      uniqueEpisodeId: episode.unique_episode_id || episode.uniqueEpisodeId,
      videoUrl: episode.video_url || episode.videoUrl,
      releaseDate: episode.release_datetime || episode.releaseDate,
    };
  } catch {
    return null;
  }
}
