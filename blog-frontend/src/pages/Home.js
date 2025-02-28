import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    axios.get("http://localhost:4545/api/blogs").then((res) => setBlogs(res.data.data));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Blogs</h1>
        <div className="space-x-4">
          <Link to="/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Blog
          </Link>
          {role === "admin" && (
            <Link to="/admin" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Admin Dashboard
            </Link>
          )}
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(blogs) &&
          blogs.map((blog) => (
            <Link
              to={`/blog/${blog.id}`}
              key={blog.id}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 relative"
            >
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{blog.Title}</h2>
                <p className="text-gray-600">{blog.description.substring(0, 100)}...</p>
              </div>
              {blog.verified ? (
                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full absolute top-2 right-2 z-10">
                  Verified
                </div>
              ) : null}
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Home;
