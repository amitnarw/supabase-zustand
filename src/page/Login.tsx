import { LoginForm } from "@/components/login-form";
import Navbar from "@/components/Navbar";
import supabase from "@/utils/supabase";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Login = () => {
  const router = useNavigate();
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
      let { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setIsLoading(false);
      if (error) {
        toast.error(error?.message);
      } else {
        router("/home");
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
    <>
      <LoginForm
        className="w-[500px] m-auto mt-20"
        onSubmit={onSubmit}
        googleLogin={googleLogin}
      />
    </>
  );
};

export default Login;
