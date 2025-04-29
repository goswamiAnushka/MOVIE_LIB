import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = useSelector(state => state.user.user);

  // Check if the user is authenticated
  if (!user || !user._id) {
    // Redirect to login if no user is found
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;