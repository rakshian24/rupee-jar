import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants";
import { useAuth } from "../context/authContext";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};
export default ProtectedRoute;
