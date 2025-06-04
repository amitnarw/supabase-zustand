import LoadingIcon from "@/components/LoadingIcon";
import { RegisterForm } from "@/components/register-form";
import supabase from "@/utils/supabase";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Register = () => {
  const router = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    let name = await formData.get("name")?.toString();
    let email = formData.get("email")?.toString();
    let password = formData.get("password")?.toString();

    if (!name || !email || !password) {
      toast("Please provide name, email and password");
    } else {
      setIsLoading(true);
      let { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name,
          },
        },
      });
      setIsLoading(false);
      if (error) {
        toast(error?.message);
      } else {
        router("/login");
      }
    }
  };

  const googleRegister = async () => {
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
      <RegisterForm
        className="max-w-[500px] min-w-[300px] px-5 m-auto mt-20"
        onSubmit={onSubmit}
        googleRegister={googleRegister}
      />
      {isLoading && <LoadingIcon />}
    </>
  );
};

export default Register;
