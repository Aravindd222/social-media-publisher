import API from "./api";

export const createPost = async (data) => {
  const res = await API.post("/posts/", data);
  return res.data;
};

export const getPosts = async () => {
  const res = await API.get("/posts/");
  return res.data;
};


export async function getSocialStatus() {
  const res = await API.get("/social/status");
  return res.data;
}

