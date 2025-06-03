import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Home from "./page/Home";
import Login from "./page/Login";
import Register from "./page/Register";
import { Toaster } from "./components/ui/sonner";
import ThemeStartup from "./utils/theme-service";
import useStore from "./utils/zustand_store";
import NotFound from "./page/NotFound";
import { useEffect } from "react";
import type { JSX } from "react/jsx-runtime";
import About from "./page/About";
import Logout from "./page/Logout";
import Navbar from "./components/Navbar";
import Contact from "./page/Contact";
import PaymentSuccess from "./page/PaymentSuccess";
import PaymentFailed from "./page/PaymentFailed";
import Cart from "./page/Cart";
import Orders from "./page/Orders";
import LoadingSmall from "./components/LoadingSmall";

function App() {
  const { user, isUserDataLoading, initializeUser } = useStore();

  useEffect(() => {
    initializeUser();
  }, []);

  const CheckProtectedRoutes = (component: JSX.Element, auth: boolean) => {
    if (!isUserDataLoading) {
      if (user && auth) {
        return <Navigate to={"/"} replace />;
      } else if (user && !auth) {
        return component;
      } else if (!user && auth) {
        return component;
      } else if (!user && !auth) {
        const hash = window.location.hash;
        if (hash.includes("access_token")) {
          return component;
        } else {
          return <Navigate to={"/login"} replace />;
        }
      } else {
        return component;
      }
    }
  };

  if (isUserDataLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSmall />
      </div>
    );
  }

  return (
    <div>
      <BrowserRouter>
        <Toaster />
        <ThemeStartup />
        <Navbar />
        <div className="pt-20 overflow-hidden">
          <Routes>
            <Route
              path="/"
              element={CheckProtectedRoutes(<Home />, false)}
            ></Route>
            <Route
              path="/login"
              element={CheckProtectedRoutes(<Login />, true)}
            ></Route>
            <Route
              path="/register"
              element={CheckProtectedRoutes(<Register />, true)}
            ></Route>
            <Route
              path="/logout"
              element={CheckProtectedRoutes(<Logout />, false)}
            ></Route>
            <Route
              path="/cart"
              element={CheckProtectedRoutes(<Cart />, false)}
            ></Route>
            <Route
              path="/orders"
              element={CheckProtectedRoutes(<Orders />, false)}
            ></Route>
            <Route path="/contact" element={<Contact />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/payment-success" element={<PaymentSuccess />}></Route>
            <Route path="/payment-failed" element={<PaymentFailed />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
