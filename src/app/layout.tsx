import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AllProviders } from "@layout/all-providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});



export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable}`}>
        <AllProviders>
          {children}
        </AllProviders>
      </body>
    </html>
  );
}
