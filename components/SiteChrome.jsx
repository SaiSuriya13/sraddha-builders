"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Renders the public site header and footer everywhere except the admin area,
// which supplies its own chrome. Keeps the root layout a server component.
export function SiteChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return children;

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
