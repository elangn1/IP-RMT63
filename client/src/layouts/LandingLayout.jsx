import { Outlet } from "react-router";
import NavbarLanding from "../components/NavbarLanding";

export default function LandingLayout() {
  return (
    <div>
      <NavbarLanding />
      <Outlet />
    </div>
  );
}
