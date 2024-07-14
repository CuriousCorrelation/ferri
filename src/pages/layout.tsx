import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { ReactElement } from "react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <main
      className={cn(
        "h-screen w-screen font-sans antialiased",
        fontSans.variable,
      )}
    >
      {children}
    </main>
  );
}
