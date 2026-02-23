import API from "./api";


/**
 * Publish or schedule a post
 * @param {Object} payload
 * @param {string} payload.platform - "linkedin"
 * @param {string} payload.content
 * @param {string|null} payload.scheduled_at
 */
export async function createPost(payload) {
  try {
    const url = payload.platform === "linkedin" && payload.scheduled_at ? "/social/schedule/linkedin" : "/social/publish";
    const res = await API.post(url, payload);
    return res.data;
  } catch (err) {
    console.error("Create post failed:", err);

    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      "Failed to publish post";

    throw new Error(message);
  }
}


export const getMyPosts = async () => {
  const res = await API.get("/posts/");
  return res.data;
};

// Only scheduled
export const getScheduledPosts = async () => {
  const res = await API.get("/posts/me?status=pending");
  return res.data;
};

// History (published + failed)
export const getHistoryPosts = async () => {
  const res = await API.get("/posts/me");
  return res.data.filter(
    (p) => p.status === "published" || p.status === "failed"
  );
};

export async function getSocialStatus() {
  const res = await API.get("/social/status");
  return res.data;
}

export const getDashboardSummary = async () => {
  const res = await API.get("/posts/summary");
  return res.data;
};

