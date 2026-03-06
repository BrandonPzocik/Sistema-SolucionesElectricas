import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/Layout";
import { HomePage } from "../features/home/HomePage";
import { CatalogPage } from "../features/catalog/CatalogPage";
import { ServicesPage } from "../features/services/ServicesPage";
import { GraciasPage } from "../features/gracias/GraciasPage";
import { AdminPage } from "../features/admin/AdminPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/productos", element: <CatalogPage /> },
      { path: "/servicios", element: <ServicesPage /> },
      { path: "/gracias", element: <GraciasPage /> },
      { path: "/admin", element: <AdminPage /> },
      { path: "/admin/services", element: <AdminPage /> }
    ]
  }
]);
