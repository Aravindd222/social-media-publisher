import API from "./api";

/**
 * Connect Instagram account
 * @param {{ access_token: string, ig_user_id: string }}
 */
export async function connectInstagram(payload) {
  const res = await API.post("/social/connect/instagram", payload);
  return res.data;
}

/**
 * Publish or schedule Instagram post
 * @param {FormData} formData
 */
export async function publishInstagram(formData) {
  const res = await API.post("/social/publish/instagram", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}
