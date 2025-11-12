import {Navigate} from "react-router-dom";

function ProtectedRoute({children}) {
  const isAuthenticated = () => {
    return localStorage.getItem("isAuthenticated") === "true";
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
