import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      //console.log("heelo")
      const res = await axios.post("http://localhost:4545/api/auth/login", { email, password });
      //console.log("res.data.user.role")
      localStorage.setItem("token", res.data.token);
      if (res.data && res.data.user) {
        localStorage.setItem("role", res.data.user.isAdmin ? "admin" : "user");
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        console.error("Login error: user data is missing in the response");
        alert("Login failed: Could not retrieve user role.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input className="border p-2 w-full mb-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" className="border p-2 w-full mb-2" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded w-full">Login</button>
      <button onClick={() => navigate("/admin/login")} className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-2">Admin Login</button>
    </div>
  );
}

export default Login;
