"use client";

import { usePathname } from "next/navigation";
import DashNav from "./DashNav";
import { LandingNavbar } from "./landing/sections/LandingNavbar";
const NavBar = () => {
  const pathname = usePathname();
  if (pathname === "/") {
    return <LandingNavbar />;
  }
  if (pathname.startsWith("/dashboard")) {
    return <DashNav />;
  }
  return null;
};

export default NavBar;
