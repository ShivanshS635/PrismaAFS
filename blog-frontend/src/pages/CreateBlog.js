import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [premium, setPremium] = useState(false);

  const handleCreate = async () => {
    try {
      if (!title || !description) {
        toast.error("Please fill in all required fields.");
        return;
      }
      
      const token = sessionStorage.getItem("token");
      await axios.post(
        "http://localhost:4545/api/blogs",
        { title, description, premium },
        {
          headers: { Authorization: token },
        }
      );
      toast.success("Blog created successfully!");
      window.location.href = "/";
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create blog. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={premium}
            onChange={(e) => setPremium(e.target.checked)}
          />
          <span>Premium Content</span>
        </label>
      </div>
      <button
        onClick={handleCreate}
        className="bg-green-500 text-white px-4 py-2 rounded w-full"
      >
        Create
      </button>
    </div>
  );
}

export default CreateBlog;
