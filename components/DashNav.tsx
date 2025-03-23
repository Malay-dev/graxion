import React from "react";
import { ToggleTheme } from "./layout/toggle-theme";
import TeamSwitcher from "./TeamSwitcher";
import { Search } from "./Search";
import { UserNav } from "./UserNav";
const DashNav = () => {
  return (
    <>
      <ToggleTheme />
      <TeamSwitcher />
      <div className="ml-auto flex items-center space-x-4">
        <Search />
        <UserNav />
      </div>
    </>
  );
};

export default DashNav;
