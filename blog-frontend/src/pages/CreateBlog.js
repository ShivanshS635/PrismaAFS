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
        "https://prismaafs.onrender.com/api/blogs",
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
    <div className="min-h-screen bg-gray-100 py-6 sm:py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Create Blog</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter blog title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="6"
              placeholder="Enter blog content"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="premium"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={premium}
              onChange={(e) => setPremium(e.target.checked)}
            />
            <label htmlFor="premium" className="ml-2 block text-sm text-gray-900">
              Premium Content
            </label>
          </div>
          <button
            onClick={handleCreate}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Create Blog
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;
