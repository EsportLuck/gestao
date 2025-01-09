import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/template/header";
import NextAuthSessionProvider from "@/providers/sessionProvider";
import { StrictMode } from "react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui";
import { ThemeProvider } from "@/providers/theme-provider";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Gestão",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          `min-h-screen bg-background antialiased `,
          fontSans.variable,
        )}
      >
        <div className="md:p-2 max-w-7xl mx-auto my-0">
          <NextAuthSessionProvider>
            <StrictMode>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Header />
                {children}
                <Toaster />
              </ThemeProvider>
            </StrictMode>
          </NextAuthSessionProvider>
        </div>
      </body>
    </html>
  );
}
