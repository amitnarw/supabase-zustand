import "./App.css";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import Home from "./page/Home";
import Login from "./page/Login";
import Register from "./page/Register";
import { Toaster } from "./components/ui/sonner";
import ThemeStartup from "./utils/theme-service";
import useStore from "./utils/zustand_store";
import NotFound from "./page/NotFound";
import { useEffect } from "react";
import About from "./page/About";
import Logout from "./page/Logout";
import Navbar from "./components/Navbar";
import Contact from "./page/Contact";
import PaymentSuccess from "./page/PaymentSuccess";
import PaymentFailed from "./page/PaymentFailed";
import Cart from "./page/Cart";
import Orders from "./page/Orders";
import LoadingSmall from "./components/LoadingSmall";
import AuthCallback from "./page/AuthCallback";

const ProtectRoutes = ({ user }: any) => {
  if (user) {
    return <Outlet />;
  }
  return <Navigate to={"/login"} replace />;
};

const AuthenticationRoutes = ({ user }: any) => {
  if (user) {
    return <Navigate to={"/"} replace />;
  }
  return <Outlet />;
};

function App() {
  const { user, isUserDataLoading, checkUserSessionLocal } = useStore();
  useEffect(() => {
    checkUserSessionLocal();
  }, []);

  if (isUserDataLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSmall />
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Toaster />
        <ThemeStartup />
        <Navbar />
        <div className="pt-20 overflow-hidden w-full">
          <Routes>
            <Route element={<ProtectRoutes user={user} />}>
              <Route path="/" element={<Home />}></Route>
              <Route path="/home" element={<Navigate to={"/"} />}></Route>
              <Route path="/logout" element={<Logout />}></Route>
              <Route path="/cart" element={<Cart />}></Route>
              <Route path="/orders" element={<Orders />}></Route>
              <Route
                path="/payment-success"
                element={<PaymentSuccess />}
              ></Route>
              <Route path="/payment-failed" element={<PaymentFailed />}></Route>
            </Route>
            <Route element={<AuthenticationRoutes user={user} />}>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
            </Route>

            <Route path="/contact" element={<Contact />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/auth/callback" element={<AuthCallback />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
