import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import ViewSwitcher from "./ViewSwitcher";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "T.R.I.O — Patient Intake",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={manrope.className}>
      <body className="antialiased">
        {children}
        <ViewSwitcher current="/" />
      </body>
    </html>
  );
}
