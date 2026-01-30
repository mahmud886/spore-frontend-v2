"use client";

import { useEffect } from "react";

export default function ExternalStyles() {
  useEffect(() => {
    // Add Material Symbols Outlined
    const materialSymbols = document.createElement("link");
    materialSymbols.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
    materialSymbols.rel = "stylesheet";
    document.head.appendChild(materialSymbols);

    // Add Font Awesome
    const fontAwesome = document.createElement("link");
    fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    fontAwesome.rel = "stylesheet";
    document.head.appendChild(fontAwesome);

    return () => {
      // Cleanup on unmount
      if (document.head.contains(materialSymbols)) {
        document.head.removeChild(materialSymbols);
      }
      if (document.head.contains(fontAwesome)) {
        document.head.removeChild(fontAwesome);
      }
    };
  }, []);

  return null;
}
