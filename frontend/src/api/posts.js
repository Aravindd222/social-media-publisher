import API from "./auth.js";

export const createPost = async (data) => {
  const res = await API.post("/posts/", data);
  return res.data;
};

export const getPosts = async () => {
  const res = await API.get("/posts/");
  return res.data;
};
