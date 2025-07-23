import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Toaster, toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";

export function SignIn() {
  const { singin, signup, googleSignIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      let msg = "Something went wrong";
      switch (error) {
        case 400:
          msg = "Username or password is required";
          break;
        case 404:
          msg = "User does not exist";
          break;
        case 401:
          msg = "Invalid User Credentials";
          break;
      }
      toast.error(msg);
    }
  }, [error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    const credentials = { email, password };

    setLoading(true);
    setError(null);

    try {
      let userData;
      if (mode === "login") {
        userData = await singin(credentials);
      } else {
        userData = await signup(credentials);
      }
      if (userData) {
        navigate("/dashboard/");
      }
    } catch (err) {
      setError(err.response?.status || "unknown");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    if (!credential) return;
  
    setLoading(true);
    try {
      const data = await googleSignIn(credential);
      if(data){
        navigate("/dashboard/");
      }
    } catch (err) {
      toast.error("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className={cn("flex flex-col gap-6")}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    {mode === "login" ? "Welcome back" : "Create an account"}
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    {mode === "login"
                      ? "Login to your Acme Inc account"
                      : "Sign up for an Acme Inc account"}
                  </p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {/* {mode === "login" && (
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    )} */}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && (
                    <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                  )}
                  {loading
                    ? mode === "login"
                      ? "Logging in..."
                      : "Signing up..."
                    : mode === "login"
                    ? "Login"
                    : "Sign up"}
                </Button>

                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>

                <div className="grid">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google login failed")}
                  />
                </div>

                <div className="text-center text-sm">
                  {mode === "login" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        className="underline underline-offset-4"
                        onClick={() => setMode("signup")}
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="underline underline-offset-4"
                        onClick={() => setMode("login")}
                      >
                        Login
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>

            <div className="bg-muted relative hidden md:block">
              <img
                src="/logo.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>

        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </div>
      </div>

      <Toaster expand={true} richColors />
    </>
  );
}
