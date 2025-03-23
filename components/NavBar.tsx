"use client";

import { useEffect, useState } from "react";
import DashNav from "./DashNav";
import AssessmentNav from "./AssessmentNav";

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
      <div className="flex h-16 items-center px-4">
        {pathname === "dashboard" && <DashNav />}
        {pathname === "assessment" && <AssessmentNav />}
      </div>
    </div>
  );
};

export default NavBar;
