"use client";

import { useEffect, useState } from "react";
import DashNav from "./DashNav";
import { LandingNavbar } from "./landing/sections/LandingNavbar";
const NavBar = () => {
  const [pathname, setPathname] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      setPathname(pathParts[1]);
      console.log(pathParts);
    }
  }, []);

  return (
    <>
      {pathname === "dashboard" && <DashNav />}
      {pathname == "" && <LandingNavbar />}
    </>
  );
};

export default NavBar;
