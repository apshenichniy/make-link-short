"use client";

import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";

const Providers: React.FC<PropsWithChildren> = ({ children, ...props }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      enableSystem
      {...props}
    >
      {children}
    </ThemeProvider>
  );
};

export { Providers };
