import useAuthStore from "../zustand/authStore";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Element }) => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
