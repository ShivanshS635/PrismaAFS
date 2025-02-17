import { useState } from "react";
import axios from "axios";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:4545/api/blogs", { title, description }, {
      headers: { Authorization: token },
    });
    window.location.href = "/";
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      <input className="border p-2 w-full mb-2" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <textarea className="border p-2 w-full mb-2" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-2 rounded w-full">Create</button>
    </div>
  );
}

export default CreateBlog;
