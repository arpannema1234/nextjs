"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const token = localStorage.getItem("token");
export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
    axios
      .get("http://localhost:5000/posts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res: any) => setPosts(res.data));
  }, [token]);

  return (
    <div>
      <h1>Dashboard</h1>
      {posts.map((post: any) => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
