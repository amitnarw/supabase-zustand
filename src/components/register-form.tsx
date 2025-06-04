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

interface AllProps extends React.ComponentProps<"div"> {
  onSubmit: (event: React.FormEvent) => void;
  googleRegister: () => void;
}

export function RegisterForm({
  className,
  onSubmit,
  googleRegister,
  ...props
}: AllProps) {
  const [isView, setIsView] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Register for new account</CardTitle>
          <CardDescription>Enter info to create new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="abc"
                  required
                />
              </div>
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
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                  Register
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={googleRegister}
                >
                  Register with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
