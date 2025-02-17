import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <Link to="/" className="text-xl">My Blog</Link>
      <div>
        {localStorage.getItem("token") ? (
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
        ) : (
          <Link to="/login" className="px-4 py-2 bg-green-500 rounded">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
