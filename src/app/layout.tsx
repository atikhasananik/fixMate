import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

// Runs in <head> before first paint so a stored dark theme is applied without FOUC.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("fixmate-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = stored === "dark" || (stored !== "light" && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (error) {}
})();
`;

export const metadata: Metadata = {
  title: {
    default: "FixMate — On-demand repair services",
    template: "%s | FixMate",
  },
  description:
    "Book verified technicians for smartphone, appliance, and electronics repairs with transparent job tracking and pay-after-service.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${roboto.variable} ${roboto.className} ${robotoMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
