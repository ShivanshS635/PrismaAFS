import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:4545/api/blogs/${id}`)
      .then((res) => setBlog(res.data.data))
      .catch((err) => console.error("Error fetching blog:", err));
  }, [id]);

  const handleLike = () => {
    axios
      .post(`http://localhost:4545/api/likes/${id}`)
      .then((res) => {
        alert("Liked successfully");
      })
      .catch((err) => console.error("Error liking blog:", err));
  };

  if (!blog) {
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  }

  return (
    <>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{blog.Title}</h1>
        <p className="text-gray-600 mb-4">By Author ID: {blog.authorId}</p>
        <p className="text-lg">{blog.description}</p>
        <div className="mt-4 flex gap-4">
          <button
            onClick={handleLike}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Like
          </button>
        </div>
      </div>
    </>
  );
}

export default BlogDetails;
