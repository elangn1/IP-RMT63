import NavbarHome from "../components/NavbarHome";
import { Outlet, Navigate } from "react-router";

export default function AuthLayout() {
  const access_token = localStorage.getItem("access_token");
  if (!access_token) {
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <NavbarHome />
      <Outlet />
    </div>
  );
}
