import React from "react";
import { Spinner } from "@phosphor-icons/react/dist/ssr";

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

const Loading = ({ text = "Loading...", fullScreen = true }: LoadingProps) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen dark:bg-black bg-white" : "h-full"
      }`}>
      <div className="flex items-center gap-2 text-primary">
        <Spinner className="animate-spin h-8 w-8" />
        {text}
      </div>
    </div>
  );
};

export default Loading;
