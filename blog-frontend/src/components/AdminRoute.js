import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const role = localStorage.getItem("role");
  if (role === "admin") {
    return children;
  } else {
    return <Navigate to="/admin/login" />;
  }
}

export default AdminRoute;
