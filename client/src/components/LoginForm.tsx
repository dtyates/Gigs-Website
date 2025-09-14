import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LoginFormProps {
  onLogin: () => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const handleSignIn = () => {
    onLogin();
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
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Login */}
            <Button
              className="w-full"
              onClick={handleSignIn}
              data-testid="button-sign-in"
            >
              <Music className="h-4 w-4 mr-2" />
              Sign In to Festival Planner
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          Sign in with your existing account to continue
        </div>
      </div>
    </div>
  );
}