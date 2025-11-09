import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import TableOffficeHourPage from "@/pages/TableOffficeHourPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [{ path: "", element: <TableOffficeHourPage file="t10-2025" /> }],
    },
]);

export default router;
