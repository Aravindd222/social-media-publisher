const API_URL = "http://localhost:8000";

export async function createPost(data, token) {
  const res = await fetch(`${API_URL}/posts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error("Post creation failed");
  return res.json();
}

export async function getPosts(token) {
  const res = await fetch(`${API_URL}/posts/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}
