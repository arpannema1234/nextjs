"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((res: any) => setPosts(res.data));
  }, []);

  return (
    <div>
      <h1>Personal Blog</h1>
      <Link href="/login">Login</Link>
      <Link href="/signup">Signup</Link>
      {posts.map((post: any) => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
