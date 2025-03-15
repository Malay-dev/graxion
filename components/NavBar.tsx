"use client";

import { Search } from "./Search";
import { MainNav } from "./MainNav";
import { UserNav } from "./UserNav";
import TeamSwitcher from "./TeamSwitcher";
import { ToggleTheme } from "./layout/toggle-theme";

const NavBar = () => {
  const pathname = window.location.pathname;

  return (
    <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <ToggleTheme />
            <TeamSwitcher />
            {pathname !== "/dashboard" &&
              <MainNav className="mx-6" />
            }
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
  );
};

export default NavBar;