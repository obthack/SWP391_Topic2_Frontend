//jsx la dinh dang giup minh phoi hop javascript & html de dang

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/dashboard";
import ManageCategory from "./pages/category";
import ManageBike from "./pages/bike";
import { ToastContainer } from "react-toastify";

//1.Component
// la 1 cai function
// tra ve 1 cai giao dien  
function App(){
const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
        {
            path: "bike",
            element: <ManageBike />,   //outlet
        },
         {
            path: "category",
            element: <ManageCategory />,   //outlet
        },
    ],
  }, 
]);

    return(
    <>
    <ToastContainer />
    <RouterProvider router={router} />;
    </> 


    )
}

export default App;