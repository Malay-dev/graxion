import React from "react";
import { Spinner } from "@phosphor-icons/react/dist/ssr";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen dark:bg-black bg-white text-white">
      <Spinner className="animate-spin h-8 w-8 text-white mr-2" />
      Loading...
    </div>
  );
};

export default Loading;
