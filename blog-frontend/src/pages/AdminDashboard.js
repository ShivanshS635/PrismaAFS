import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchBlogs = async () => {
    const res = await axios.get("http://localhost:4545/api/admin/blogs", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    setBlogs(res.data.data);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("http://localhost:4545/api/admin/users", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setUsers(res.data.data);
    };

    fetchUsers();
    fetchBlogs();
  }, []);

  const handleVerifyBlog = async (blogId) => {
    try {
      await axios.put(
        `http://localhost:4545/api/admin/blogs/${blogId}/verify`,
        {},
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      // Refresh blogs after verification
      fetchBlogs();
    } catch (error) {
      console.error("Error verifying blog:", error);
      alert("Failed to verify blog");
    }
  };

  const handleRejectBlog = (blogId) => {
    setSelectedBlogId(blogId);
    setRejectionModalOpen(true);
  };

  const handleRejectionReasonChange = (e) => {
    setRejectionReason(e.target.value);
  };

  const submitRejection = async () => {
    try {
      await axios.put(
        `http://localhost:4545/api/admin/blogs/${selectedBlogId}/reject`,
        { rejectionReason: rejectionReason },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setRejectionModalOpen(false);
      // Refresh blogs after rejection
      fetchBlogs();
    } catch (error) {
      console.error("Error rejecting blog:", error);
      alert("Failed to reject blog");
    }
  };

  return (
    <div className="p-6">
      <>
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id} className="border p-2 rounded shadow mb-2">
                {user.name} ({user.email}) - Role: {user.role}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Blogs</h2>
          <ul>
            {blogs.map((blog) => (
              <li key={blog.id} className="border p-2 rounded shadow mb-2">
                {blog.Title}: {blog.description}
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={() => handleVerifyBlog(blog.id)}
                >
                  Verify
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={() => handleRejectBlog(blog.id)}
                >
                  Reject
                </button>
              </li>
            ))}
          </ul>
        </div>

        {rejectionModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              <div
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    Rejection Reason
                  </h3>
                  <div className="mt-2">
                    <textarea
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="4"
                      placeholder="Enter rejection reason"
                      value={rejectionReason}
                      onChange={handleRejectionReasonChange}
                    ></textarea>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={submitRejection}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setRejectionModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default AdminDashboard;
