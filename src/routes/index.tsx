import { Outlet } from "react-router-dom";
import { LoginForm } from "@/pages/auth/Login";
import { SignupForm } from "@/pages/auth/signUp";
import Dashboard from "@/pages/dashboard";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: any) => {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/login" replace />;
};

const Layout = () => (
  <div>
    <Outlet />
  </div>
);

export const routeConfig = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "login", element: <LoginForm /> },
      { path: "signup", element: <SignupForm /> },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        index: true,
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
    ],
  },
];