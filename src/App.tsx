import "./App.css";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import Home from "./page/Home";
import Login from "./page/Login";
import Register from "./page/Register";
import { Toaster } from "./components/ui/sonner";
import ThemeStartup from "./utils/theme-service";
import useStore from "./utils/zustand_store";
import NotFound from "./page/NotFound";
import { useEffect, useState } from "react";
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
import { CardsChat } from "./components/Chat";
import { MessagesSquare } from "lucide-react";
import AddProduct from "./page/AddProduct";

const ProtectRoutes = ({ user }: any) => {
  if (user) {
    return <Outlet />;
  }
  return <Navigate to={"/auth/login"} replace />;
};

const AuthenticationRoutes = ({ user }: any) => {
  if (user) {
    return <Navigate to={"/"} replace />;
  }
  return <Outlet />;
};

function App() {
  const { user, isUserDataLoading, checkUserSessionLocal } = useStore();
  const [openChat, setOpenChat] = useState(false);

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
        <Toaster richColors />
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
              <Route path="/admin/add-product" element={<AddProduct />}></Route>
              <Route
                path="/payment-success"
                element={<PaymentSuccess />}
              ></Route>
              <Route path="/payment-failed" element={<PaymentFailed />}></Route>
            </Route>
            <Route element={<AuthenticationRoutes user={user} />}>
              <Route path="/auth/login" element={<Login />}></Route>
              <Route path="/auth/register" element={<Register />}></Route>
            </Route>

            <Route path="/contact" element={<Contact />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/auth/callback" element={<AuthCallback />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </div>
        {user && (
          <div className="absolute bottom-5 right-5 z-100 fixed">
            {openChat ? (
              <CardsChat setOpenChat={setOpenChat} />
            ) : (
              <div
                className="bg-purple-400 hover:bg-purple-600 dark:bg-purple-900 dark:hover:bg-purple-700 p-4 hover:scale-110 duration-300 rounded-full cursor-pointer"
                onClick={() => setOpenChat(true)}
              >
                <MessagesSquare color="white" size={20} />
              </div>
            )}
          </div>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
