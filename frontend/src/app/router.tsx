import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/Layout";
import { CatalogPage } from "../features/catalog/CatalogPage";
import { ProductPage } from "../features/product/ProductPage";
import { CheckoutPage } from "../features/checkout/CheckoutPage";
import { AdminPage } from "../features/admin/AdminPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <CatalogPage /> },
      { path: "/producto/:slug", element: <ProductPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/admin", element: <AdminPage /> }
    ]
  }
]);
