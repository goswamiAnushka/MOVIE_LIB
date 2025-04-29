import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const user = useSelector(state => state.user.user);

  // Redirect to /community if the user is already authenticated
  if (user && user._id) {
    return <Navigate to="/community" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;