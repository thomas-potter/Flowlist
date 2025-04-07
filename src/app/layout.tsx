import { type Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

// Import Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Choose the weights you need
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Task Flow",
  description: "Manage your daily tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <head>
        <title>Task Flow</title>
        <meta name="description" content="Manage your daily tasks" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="src/app/Flowtask Icon.png" />
      </head>
      <body>
        {/* Header */}
        <SpeedInsights />
        <Analytics />
        <header className="header">
          <div className="container">
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
