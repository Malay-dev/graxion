import React from "react";
import { Button } from "./ui/button";
import { PresetShare } from "./PresetShare";

const PlayNav = () => {
  return (
    <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
      <h2 className="text-lg font-semibold">Assessment</h2>
      <div className="ml-auto flex w-full space-x-2 sm:justify-end">
        <Button>Save</Button>
        <div className="hidden space-x-2 md:flex">
          <PresetShare />
        </div>
        {/* <PresetActions /> */}
      </div>
    </div>
  );
};

export default PlayNav;
