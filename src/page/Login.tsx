import { LoginForm } from "@/components/login-form";
import supabase from "@/utils/supabase";
import useStore from "@/utils/zustand_store";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Login = () => {
  const { setUserData } = useStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    if (!email || !password) {
      toast("Please write email and password to login");
    } else {
      setIsLoading(true);
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setIsLoading(false);
      setUserData(data?.user, data?.session);
      if (error) {
        toast.error(error?.message);
      } else {
        navigate("/");
      }
    }
  };

  const googleLogin = async () => {
    let { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          prompt: "select_account",
        },
      },
    });
    if (error) {
      toast("Error while registering");
    }
  };

  return (
    <LoginForm
      className="max-w-[500px] min-w-[300px] px-5 m-auto mt-20"
      onSubmit={onSubmit}
      googleLogin={googleLogin}
      isLoading={isLoading}
    />
  );
};

export default Login;
