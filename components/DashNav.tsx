import React from "react";
import { ToggleTheme } from "./layout/toggle-theme";
import TeamSwitcher from "./TeamSwitcher";
import { UserNav } from "./UserNav";
import { Button } from "./ui/button";
import Link from "next/link";

const DashNav = () => {
  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <ToggleTheme />
          <TeamSwitcher />
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline">
              <Link href="/">Go to home</Link>
            </Button>
            <UserNav />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashNav;
