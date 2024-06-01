import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./components/Login";

function App() {
  const router = createBrowserRouter([
    {
      path:"/sale-order-management",
      element: <RootLayout />,
    },
    {path:"/", element:<Login/>}
  ]);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
