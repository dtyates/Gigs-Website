import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Music, Github, Mail, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LoginFormProps {
  onLogin: (method: "email" | "google" | "github", data?: { email: string; password: string }) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin("email", { email, password });
      setIsLoading(false);
    }, 1000);
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    onLogin(provider);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music className="h-8 w-8 text-primary" />
            <span className="font-heading font-bold text-2xl">Festival Planner</span>
          </div>
          <h1 className="font-heading text-3xl font-bold" data-testid="text-login-title">
            Welcome to Your Festival Journey
          </h1>
          <p className="text-muted-foreground">
            Discover festivals, create personalized schedules, and never miss your favorite artists
          </p>
          <Badge variant="secondary" className="text-xs">
            🎵 Join 50,000+ festival-goers
          </Badge>
        </div>

        {/* Login Card */}
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle data-testid="text-form-title">
              {isSignUp ? "Create Account" : "Sign In"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Login */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("google")}
                data-testid="button-google-login"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("github")}
                data-testid="button-github-login"
              >
                <Github className="h-4 w-4 mr-2" />
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                />
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email || !password}
                data-testid="button-email-submit"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </div>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    {isSignUp ? "Create Account" : "Sign In"}
                  </>
                )}
              </Button>
            </form>

            {/* Toggle Sign Up */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </span>{" "}
              <Button
                variant="ghost"
                className="p-0 h-auto font-normal"
                onClick={() => setIsSignUp(!isSignUp)}
                data-testid="button-toggle-signup"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}