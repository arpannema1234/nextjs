"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await axios.post("http://localhost:5000/login", {
      email,
      password,
    });
    console.log(res);
    localStorage.setItem("token", res.data.token);
    router.push("/dashboard");
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginRight: "10px", color: "black" }}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ color: "black" }}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
