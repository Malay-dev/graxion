"use client";

import { useEffect, useState } from "react";
import DashNav from "./DashNav";

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
    <div className="border-b">
      {pathname === "dashboard" && (
        <div className="flex h-16 items-center px-4">
          <DashNav />{" "}
        </div>
      )}
    </div>
  );
};

export default NavBar;
