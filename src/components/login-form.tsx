import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import LoadingSmall from "./LoadingSmall";

interface AllProps extends React.ComponentProps<"div"> {
  onSubmit: (event: React.FormEvent) => void;
  googleLogin: () => void;
  isLoading: boolean;
}

export function LoginForm({
  className,
  onSubmit,
  googleLogin,
  isLoading,
  ...props
}: AllProps) {
  const [isView, setIsView] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    placeholder="******"
                    required
                    type={isView ? "text" : "password"}
                  />
                  {isView ? (
                    <Eye
                      size={20}
                      className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                      onClick={() => {
                        setIsView(!isView), console.log(isView);
                      }}
                    />
                  ) : (
                    <EyeOff
                      size={20}
                      className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                      onClick={() => setIsView(!isView)}
                    />
                  )}
                </div>
              </div>
              {isLoading ? (
                <div className="m-auto">
                  <LoadingSmall />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full cursor-pointer">
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={googleLogin}
                  >
                    Login with Google
                  </Button>
                </div>
              )}
            </div>
            {!isLoading && (
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/auth/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
