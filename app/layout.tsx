import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seamly2D Web App",
  description: "A modern web-based pattern drafting application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
