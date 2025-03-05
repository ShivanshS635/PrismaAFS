import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:4545/api/admin/users", {
      headers: { Authorization: sessionStorage.getItem("token") },
    });
    setUsers(res.data.data);
  };

  const fetchBlogs = async () => {
    const res = await axios.get("http://localhost:4545/api/admin/blogs", {
      headers: { Authorization: sessionStorage.getItem("token") },
    });
    setBlogs(res.data.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchBlogs();
  }, []);

  const handleVerifyBlog = async (blogId) => {
    try {
      await axios.put(
        `http://localhost:4545/api/admin/blogs/${blogId}/verify`,
        {},
        {
          headers: { Authorization: sessionStorage.getItem("token") },
        }
      );
      toast.success("Blog verified successfully!");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to verify blog. Please try again.");
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
      if (!rejectionReason.trim()) {
        toast.warning("Please provide a rejection reason.");
        return;
      }
      await axios.put(
        `http://localhost:4545/api/admin/blogs/${selectedBlogId}/reject`,
        { rejectionReason: rejectionReason },
        {
          headers: { Authorization: sessionStorage.getItem("token") },
        }
      );
      toast.success("Blog rejected successfully!");
      setRejectionModalOpen(false);
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to reject blog. Please try again.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:4545/api/admin/users/${userId}`, {
        headers: { Authorization: sessionStorage.getItem("token") },
      });
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const handleSetAdmin = async (userId) => {
    try {
      await axios.put(`http://localhost:4545/api/admin/users/${userId}/set-admin`, {}, {
        headers: { Authorization: sessionStorage.getItem("token") },
      });
      toast.success("User promoted to admin successfully!");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to set user as admin. Please try again.");
    }
  };

  const handleDebarAsUser = async (userId) => {
    try {
      // Make an API call to remove admin privileges
      await axios.put(`http://localhost:4545/api/admin/users/${userId}/remove-admin`, {}, {
        headers: { Authorization: sessionStorage.getItem("token") },
      });
      toast.success("Admin privileges removed successfully!");
      fetchUsers(); // Refresh the user list
    } catch (error) {
      toast.error("Failed to remove admin privileges. Please try again.");
    }
  };

  return (
    <div className="p-6 font-sans bg-gradient-to-r from-blue-100 to-green-100 min-h-screen">
      <>
        <h1 className="text-3xl font-bold mb-4 text-blue-700 text-center">Admin Dashboard</h1>

        <div className="mb-8 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
          </div>
          <ul className=" gray-200">
            {users.map((user) => (
              <li key={user.id} className="px-6 py-4 hover:bg-gray-100 transition-colors duration-200 relative group">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-700">{user.name}</span>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                  <div className="space-x-2 absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                    {user.isAdmin ? (
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                        onClick={() => handleDebarAsUser(user.id)}
                      >
                        Debar as User
                      </button>
                    ) : (
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm"
                        onClick={() => handleSetAdmin(user.id)}
                      >
                        Set Admin
                      </button>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${user.isAdmin ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-8 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Blogs</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {blogs.map((blog) => (
              <li key={blog.id} className="px-6 py-4 hover:bg-gray-100 transition-colors duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-700">{blog.Title}</span>
                    <p className="text-gray-500 text-sm">{blog.description}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => handleVerifyBlog(blog.id)}
                    >
                      Verify
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={() => handleRejectBlog(blog.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
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