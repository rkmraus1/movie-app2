import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./pages/App.tsx";
import MovieDetail from "./pages/MovieDetail.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./components/Header.tsx";
import AnimeDetail from "./pages/AnimeDetail.tsx";

const router = createBrowserRouter([
  { path: "/", Component: App },
  { path: "/movies/:id", Component: MovieDetail },
  { path: "/animes/:id", element: <AnimeDetail/>}
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header>
      <RouterProvider router={router} />
    </Header>
  </StrictMode>
);