import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./layout/Layout";
import App from "./pages/App.tsx";
import MovieDetail from "./pages/MovieDetail.tsx";
import AnimeDetail from "./pages/AnimeDetail.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "movies/:id", element: <MovieDetail /> },
      { path: "animes/:id", element: <AnimeDetail /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>
);