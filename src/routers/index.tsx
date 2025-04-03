import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ThangHai from "../pages/thang2";
import ThangBa from "../pages/thang3";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <ThangBa /> },
            { path: "thang2", element: <ThangHai /> },
        ],
    },
]);

export default router;
