import useStore from "@/utils/zustand_store";
import { useEffect } from "react";

const Logout = () => {
  const { logout, setIsStateLoading } = useStore();

  useEffect(() => {
    setIsStateLoading(true);
    logout();
    setIsStateLoading(false);
  }, []);
  return null;
};

export default Logout;
