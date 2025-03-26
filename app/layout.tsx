import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import AuthContext from "@/context/AuthContext";
import { cn } from "@/lib/utils";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shadcn - Landing template",
  description: "Landing template from Shadcn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background", inter.className)}>
        <AuthContext>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <NavBar></NavBar>
            {children}
          </ThemeProvider>
        </AuthContext>
      </body>
    </html>
  );
}
