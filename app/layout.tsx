import "./globals.css";
import NavBar from "@/components/NavBar";
import { ThemeProvider } from "@/components/layout/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <NavBar></NavBar>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
