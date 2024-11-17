import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
  import Root from "../pages/Root";
  import Weather from "../pages/Weather";
  import ErrorPage from "../pages/ErrorPage";

  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root/>,
      errorElement: <ErrorPage />,
    },
    {
        path: "/weather",
        element: <Weather/>
    }
  ]);

export default function Router () {
    return <RouterProvider router={router} /> 
}