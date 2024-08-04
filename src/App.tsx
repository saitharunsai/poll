import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routeConfig } from "./routes";
import { useAuthRefresh } from "./hooks/auth";
import { Toaster } from "@/components/ui/toaster";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { ACCESS_TOKEN_KEY, fetchUser } from "./redux/slices/authSlice";
import { useSocket } from "./hooks/useSocket";

function App() {
  const dispatch: any = useDispatch();

  const renderRoutes = (routes: any[]) => {
    return routes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)}
      </Route>
    ));
  };
  useAuthRefresh();
  useSocket();

  useEffect(() => {
    localStorage.getItem(ACCESS_TOKEN_KEY) && dispatch(fetchUser());
  }, [dispatch]);

  return (
    <Router>
      <Toaster />
      <Routes>{renderRoutes(routeConfig)}</Routes>
    </Router>
  );
}

export default App;
