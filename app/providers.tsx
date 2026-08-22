"use client";

import MainLayout from "@/helpers/MainLayout";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <MainLayout>{children}</MainLayout>
      </NextThemesProvider>
    </NextUIProvider>
  );
}
