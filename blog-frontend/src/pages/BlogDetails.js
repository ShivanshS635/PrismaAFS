import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:4545/api/blogs/${id}`)
      .then((res) => setBlog(res.data.data))
      .catch((err) => console.error("Error fetching blog:", err));
  }, [id]);

  if (!blog) {
    return <div className="text-center mt-10 text-xl">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{blog.Title}</h1>
      <p className="text-gray-600 mb-4">By Author ID: {blog.authorId}</p>
      <p className="text-lg">{blog.description}</p>
    </div>
  );
}

export default BlogDetails;
