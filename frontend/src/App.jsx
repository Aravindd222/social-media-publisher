import { useState } from "react";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import PostList from "./pages/PostList";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <>
      <Login></Login>
      <CreatePost />
      <PostList />
    </>
  );
}
