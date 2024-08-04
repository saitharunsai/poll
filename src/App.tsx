import "./App.css";
import { LoginForm } from "./pages/auth/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { routeConfig } from "./routes";
import { useAuthRefresh } from "./hooks/auth";
import { Toaster } from "@/components/ui/toaster"

function App() {
  const renderRoutes = (routes: any[]) => {
    return routes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)}
      </Route>
    ));
  };
  useAuthRefresh();
  return (
    <Router>
      <Toaster />
      <Routes>{renderRoutes(routeConfig)}</Routes>
    </Router>
  );
}

export default App;
