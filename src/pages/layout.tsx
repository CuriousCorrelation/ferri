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
        "min-h-screen min-w-screen font-sans antialiased p-2",
        fontSans.variable,
      )}
    >
      {children}
    </main>
  );
}
