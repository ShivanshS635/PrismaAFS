import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    axios.get("http://localhost:4545/api/blogs").then((res) => setBlogs(res.data.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Blogs</h1>
      <Link to="/create" className="bg-blue-500 text-white px-4 py-2 rounded">Create Blog</Link>
      {role === "admin" && (
        <Link to="/admin" className="bg-green-500 text-white px-4 py-2 rounded ml-4">
          Admin Dashboard
        </Link>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {Array.isArray(blogs) && blogs.map((blog) => (
          <Link to={`/blog/${blog.id}`} key={blog.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{blog.Title}</h2>
            <p>{blog.description.substring(0, 100)}...</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
