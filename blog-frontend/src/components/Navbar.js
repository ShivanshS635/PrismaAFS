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
    <nav className="bg-gray-100 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          Blog App
        </Link>
        <div>
          {token ? (
            <>
              {role === "admin" && (
                <Link to="/admin" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                  Admin Dashboard
                </Link>
              )}
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                Login
              </Link>
              <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded">
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
