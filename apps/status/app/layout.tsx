import { Metadata } from "next";
import "./globals.css";
import { FirebaseProvider } from "@/components/firebase";

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
      <FirebaseProvider>
        <body>{children}</body>
      </FirebaseProvider>
    </html>
  );
}
