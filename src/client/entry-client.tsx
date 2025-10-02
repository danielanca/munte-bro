// src/client/entry-client.tsx
import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./index.css";

const router = createBrowserRouter([{ path: "/*", element: <App /> }]);

function Root() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

const container = document.getElementById("app") as HTMLElement;

// dev -> render; prod with SSR markup -> hydrate
if (import.meta.env.DEV || !container.innerHTML) {
  createRoot(container).render(<Root />);
} else {
  hydrateRoot(container, <Root />);
}
