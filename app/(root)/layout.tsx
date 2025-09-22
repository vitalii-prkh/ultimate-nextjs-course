import React from "react";
import {Navbar} from "@/components/navigation/navbar";

function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <main>
      <Navbar />
      {children}
    </main>
  );
}

export default RootLayout;
