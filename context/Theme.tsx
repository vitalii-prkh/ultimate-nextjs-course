"use client";

import React from "react";
import {ThemeProviderProps, ThemeProvider} from "next-themes";

function Theme({children, ...props}: ThemeProviderProps) {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
}

export default Theme;
