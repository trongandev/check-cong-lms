import routes from "@/routers/routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(routes);

export default function App() {
    return <RouterProvider router={router} />;
}
