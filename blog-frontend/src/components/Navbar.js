import { Link } from "react-router-dom";

function Navbar() {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gray-100 p-2 sm:p-4">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <Link to="/" className="text-xl sm:text-2xl font-bold">
          Blog App
        </Link>
        <div className="flex flex-wrap justify-center gap-2">
          {token ? (
            <>
              {role === "admin" && (
                <Link to="/admin" className="inline-block bg-blue-500 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base">
                  Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="inline-block bg-red-500 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="inline-block bg-blue-500 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base">
                Login
              </Link>
              <Link to="/register" className="inline-block bg-green-500 text-white px-3 sm:px-4 py-2 rounded text-sm sm:text-base">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
