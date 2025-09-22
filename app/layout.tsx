import React from "react";
import type {Metadata} from "next";
import {Inter, Space_Grotesk} from "next/font/google";
import {SessionProvider} from "next-auth/react";
import Theme from "@/context/Theme";
import {auth} from "@/auth";
import {Toaster} from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dev Overflow",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structures, and more.",
  icons: {
    icon: "/images/site-logo.svg",
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

async function RootLayout({children}: RootLayoutProps) {
  const session = await auth();

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <SessionProvider session={session}>
        <body
          className={`${inter.className} ${spaceGrotesk.variable} antialiased`}
        >
          <Theme
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </Theme>
          <Toaster richColors />
        </body>
      </SessionProvider>
    </html>
  );
}

export default RootLayout;
