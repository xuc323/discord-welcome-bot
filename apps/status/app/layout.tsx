import { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Discord Welcome Bot",
  description: "Songs requested by Discord Welcome Bot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
