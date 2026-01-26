import API from "./api";

export async function connectInstagram(data) {
  return API.post("/social/connect/instagram", data);
}


export const publishInstagram = (formData) =>
  API.post("/social/publish/instagram", formData);

