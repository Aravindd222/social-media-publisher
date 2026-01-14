import API from "./api";

export const login = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};
