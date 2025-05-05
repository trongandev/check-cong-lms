import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ThangHai from "../pages/thang2";
import ThangBa from "../pages/thang3";
import Thang4 from "@/pages/thang4";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <Thang4 /> },
            { path: "thang2", element: <ThangHai /> },
            { path: "thang3", element: <ThangBa /> },
        ],
    },
]);

export default router;
