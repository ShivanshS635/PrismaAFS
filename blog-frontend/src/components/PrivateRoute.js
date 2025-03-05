import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = sessionStorage.getItem("token");
  if (token) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default PrivateRoute;
