import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  let token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;