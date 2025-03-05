import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [purchasedBlogs, setPurchasedBlogs] = useState([]);
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogsRes = await axios.get("https://prismaafs.onrender.com/api/blogs");
        setBlogs(blogsRes.data.data);

        if (token) {
          const purchasedRes = await axios.get("https://prismaafs.onrender.com/api/blogs/purchases", {
            headers: { Authorization: token }
          });
          setPurchasedBlogs(purchasedRes.data.purchases.map(p => p.blogId));
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchData();
  }, [token]);

  const isPurchased = (blogId) => {
    return purchasedBlogs.includes(blogId);
  };

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
              to={`/blog/${blog.id}`}  // Changed from /blog/${blog.id} to include 'blog' in the path
              key={blog.id}
              className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 relative"
            >
              <div className={`p-4 ${blog.premium && !isPurchased(blog.id) ? 'blur-sm' : ''}`}>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{blog.Title}</h2>
                <p className="text-gray-600">{blog.description.substring(0, 100)}...</p>
              </div>
              {blog.premium && !isPurchased(blog.id) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg">
                    {isPurchased(blog.id) ? 'Purchased' : 'Premium Content'}
                  </div>
                </div>
              )}
              {blog.premium && (
                <div className="bg-yellow-500 p-1 rounded-full absolute top-2 right-2 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crown">
                    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/>
                    <path d="M5 21h14"/>
                  </svg>
                </div>
              )}
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Home;
