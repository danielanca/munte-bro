// src/client/entry-client.tsx
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";

// NOTE: App must NOT create its own <BrowserRouter />;
// RouterProvider handles routing at the top level.
const router = createBrowserRouter([{ path: "/*", element: <App /> }]);

function Root() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

const container = document.getElementById("root");
if (!container) throw new Error('Missing <div id="root"> in index.html');

// Hydrate when SSR markup exists; otherwise mount fresh.
if (container.hasChildNodes()) {
  hydrateRoot(container, <Root />);
} else {
  createRoot(container).render(<Root />);
}
