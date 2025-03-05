import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogRes = await axios.get(`https://prismaafs.onrender.com/api/blogs/${id}`);
        setBlog(blogRes.data.data);
        
        if (blogRes.data.data.premium && token) {
          const purchaseRes = await axios.get(
            `https://prismaafs.onrender.com/api/blogs/checkPurchase/${id}`,
            { headers: { Authorization: token } }
          );
          setHasPurchased(purchaseRes.data.purchased);
        }

        if (token) {
          const [likeStatus, likesCount] = await Promise.all([
            axios.get(`https://prismaafs.onrender.com/api/likes/${id}/check`, {
              headers: { Authorization: token }
            }),
            axios.get(`https://prismaafs.onrender.com/api/likes/${id}/count`)
          ]);
          
          setIsLiked(likeStatus.data.liked);
          setLikeCount(likesCount.data.count);
        }
      } catch (err) {
        console.log("hiii")
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const handlePurchase = async () => {
    try {
      await axios.post(
        `https://prismaafs.onrender.com/api/blogs/purchase/${id}`,
        {},
        { headers: { Authorization: token } }
      );
      setHasPurchased(true);
      toast.success("Blog purchased successfully! Enjoy reading.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Purchase failed. Please try again.");
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `https://prismaafs.onrender.com/api/likes/${id}`,
        {},
        { headers: { Authorization: token } }
      );
      setIsLiked(response.data.liked);
      setLikeCount(prev => response.data.liked ? prev + 1 : prev - 1);
      toast.success(response.data.liked ? "Blog liked!" : "Blog unliked!");
    } catch (err) {
      toast.error("Error updating like status. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600 bg-white p-8 rounded-lg shadow-lg">
          Blog not found 😢
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 sm:py-8 md:py-12 px-2 sm:px-4 md:px-8">
      <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8">
          {/* Header Section */}
          <header className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.Title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {blog.author.name ? blog.author.name[0].toUpperCase() : '?'}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">By {blog.author.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">{blog.author.email}</p>
                </div>
              </div>
              {blog.premium && (
                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  Premium
                </span>
              )}
            </div>
          </header>

          {/* Content Section */}
          <div className={`relative ${blog.premium && !hasPurchased ? "filter blur-sm" : ""}`}>
            <div className="prose prose-lg max-w-none text-gray-700">
              {blog.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Premium Purchase Section */}
          {blog.premium && !hasPurchased && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Content</h3>
                <p className="text-gray-600 mb-6">Unlock this premium article to continue reading</p>
                <button
                  onClick={handlePurchase}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-8 py-3 rounded-full font-medium hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105"
                >
                  Purchase Now
                </button>
              </div>
            </div>
          )}

          {/* Actions Section */}
          {(!blog.premium || hasPurchased) && (
            <div className="mt-8 flex items-center justify-between border-t pt-4">
              <button
                onClick={handleLike}
                className={`inline-flex items-center px-6 py-3 rounded-lg ${
                  isLiked ? 'bg-pink-600' : 'bg-blue-600'
                } text-white font-medium hover:bg-opacity-90 transition-colors duration-300`}
              >
                <svg className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isLiked ? 'Liked' : 'Like'} ({likeCount})
              </button>
              <div className="flex space-x-4">
                {/* Add share buttons or other actions here */}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export default BlogDetails;
