import { useLocation } from "react-router-dom";
import NavbarSimple from "./NavbarSimple";
import NavbarFull from "./NavbarFull";

const Navbar = () => {
  const location = useLocation();

  const simpleRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  const isSimplePage = simpleRoutes.includes(location.pathname);

  return isSimplePage ? <NavbarSimple /> : <NavbarFull />;
};

export default Navbar;
