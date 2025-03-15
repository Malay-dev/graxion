import React from 'react'
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Manage your classes",
  };
  
const DashboardLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
  )
}

export default DashboardLayout