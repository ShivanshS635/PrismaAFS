import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:4545/api/auth/register", { email, name, password, isAdmin: true });
      navigate("/admin/login");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Admin Registration failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Register</h1>
      <input className="border p-2 w-full mb-2" placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input className="border p-2 w-full mb-2" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" className="border p-2 w-full mb-2" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister} className="bg-blue-500 text-white px-4 py-2 rounded w-full">Register</button>
    </div>
  );
}

export default AdminRegister;
