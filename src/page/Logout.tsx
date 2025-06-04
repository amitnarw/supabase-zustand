import useStore from "@/utils/zustand_store";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const Logout = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      logout();
    } else {
      navigate("/login")
    }
  }, []);
  return null;
};

export default Logout;
