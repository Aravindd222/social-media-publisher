import API from "./api";

export async function connectInstagram(data) {
  return API.post("/social/connect/instagram", data);
}


export const publishInstagram = (data) =>
  API.post("/social/publish/instagram", data);
