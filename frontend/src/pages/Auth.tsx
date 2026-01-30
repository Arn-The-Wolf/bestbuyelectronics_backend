import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, Eye, EyeOff } from "lucide-react";
import CountryCodeSelect from "@/components/CountryCodeSelect";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [countryCode, setCountryCode] = useState("+255");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Combine country code and phone number
    const fullPhone = `${countryCode}${phoneNumber.replace(/\s+/g, '')}`;

    // Validate phone number
    if (!phoneNumber.trim()) {
      toast({
        title: "Error",
        description: "Phone number is required",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Remove any non-digit characters except + from phone number
    const cleanPhoneNumber = phoneNumber.replace(/[^\d]/g, '');
    if (cleanPhoneNumber.length < 6) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const finalPhone = `${countryCode}${cleanPhoneNumber}`;

    // Validate password for signup
    if (!isLogin) {
      if (!password) {
        toast({
          title: "Error",
          description: "Password is required",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    // Validate password for login
    if (isLogin && !password) {
      toast({
        title: "Error",
        description: "Password is required",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await authApi.login(finalPhone, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
          variant: "success",
        });

        // Check for redirect URL
        const returnUrl = localStorage.getItem('redirect_after_login');
        if (returnUrl) {
          localStorage.removeItem('redirect_after_login');
          navigate(returnUrl);
          return;
        }

        // Check if user is admin and redirect to admin dashboard
        try {
          const userData = await authApi.getCurrentUser();
          if (userData.user?.role === 'admin') {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } catch {
          navigate("/");
        }
      } else {
        await authApi.signup(finalPhone, password, fullName);
        toast({
          title: "Account created!",
          description: "Welcome to BestBuyElectronics!",
          variant: "success",
        });
        // Check if user is admin and redirect to admin dashboard
        try {
          const userData = await authApi.getCurrentUser();
          if (userData.user?.role === 'admin') {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } catch {
          navigate("/");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Smartphone className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Sign in to your BestBuyElectronics account"
              : "Join BestBuyElectronics today"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <CountryCodeSelect
                  value={countryCode}
                  onValueChange={setCountryCode}
                />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="123******"
                  value={phoneNumber}
                  onChange={(e) => {
                    // Only allow digits and spaces
                    const value = e.target.value.replace(/[^\d\s]/g, '');
                    setPhoneNumber(value);
                  }}
                  className="flex-1"
                  required
                />
              </div>
              {phoneNumber && (
                <p className="text-xs text-muted-foreground">
                  Full number: {countryCode}{phoneNumber.replace(/\s+/g, '')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                    required={!isLogin}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive">
                    Passwords do not match
                  </p>
                )}
                {confirmPassword && password === confirmPassword && password.length > 0 && (
                  <p className="text-xs text-green-600">
                    Passwords match
                  </p>
                )}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                // Reset form fields when switching between login and signup
                setPassword("");
                setConfirmPassword("");
                setPhoneNumber("");
                setFullName("");
                setShowPassword(false);
                setShowConfirmPassword(false);
              }}
              className="text-primary hover:underline"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;