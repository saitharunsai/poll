import { Outlet, Navigate, useLocation } from "react-router-dom";
import { LoginForm } from "@/pages/auth/Login";
import { SignupForm } from "@/pages/auth/signUp";
import Dashboard from "@/pages/dashboard";

const PrivateRoute = ({ children }: any) => {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: any) => {
  const token = localStorage.getItem("accessToken");
  return token ? <Navigate to="/dashboard" replace /> : children;
};

const Layout = () => {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

  console.log("Current path:", location.pathname);

  if (location.pathname === "/") {
    return <Navigate to={token ? "/dashboard" : "/login"} replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export const routeConfig = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <SignupForm />
          </PublicRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
    ],
  },
];
