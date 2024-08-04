import { Layout } from "@/layout";
import { LoginForm } from "@/pages/auth/Login";
import { SignupForm } from "@/pages/auth/signUp";
import { Outlet } from "react-router-dom";
const LayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

export const routeConfig = [
  {
    path: "/",
    children: [
      { path: 'login', element: <LoginForm /> },
      { path: "signup", index: true, element: <SignupForm /> },
    ],
  },
];
