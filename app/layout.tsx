import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sidekick — remembers the people you love",
  description:
    "Tell Sidekick about the people you love; it remembers how they change over time and hands you the perfect gesture.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
