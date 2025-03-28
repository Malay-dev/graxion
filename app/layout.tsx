import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import AuthContext from "@/context/AuthContext";
import { cn } from "@/lib/utils";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Graxion: Next Gen Grading and Assessment Platform",
  description: "Revolutionizing Learning with Instant AI-Powered Feedback",
  openGraph: {
    type: "website",
    url: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "Graxion: Next Gen Grading and Assessment Platform",
    description: "Revolutionizing Learning with Instant AI-Powered Feedback",
    images: [
      {
        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
        width: 1200,
        height: 630,
        alt: "Graxion: Next Gen Grading and Assessment Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "Graxion: Next Gen Grading and Assessment Platform",
    description: "Revolutionizing Learning with Instant AI-Powered Feedback",
    images: [
      "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
    ],
  },
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
