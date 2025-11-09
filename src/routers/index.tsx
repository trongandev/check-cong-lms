import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ThangHai from "../pages/thang2";
import ThangBa from "../pages/thang3";
import Thang4 from "@/pages/thang4";
import Thang5 from "@/pages/thang5";
import Thang6 from "@/pages/thang6";
import Thang7 from "@/pages/thang7";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <Thang7 /> },
            { path: "thang6", element: <Thang6 /> },
            { path: "thang5", element: <Thang5 /> },
            { path: "thang4", element: <Thang4 /> },
            { path: "thang2", element: <ThangHai /> },
            { path: "thang3", element: <ThangBa /> },
        ],
    },
]);

export default router;
