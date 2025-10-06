// Default.tsx
import React from "react";

const DefaultLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <main className="container">{children}</main>
);

export default DefaultLayout;
