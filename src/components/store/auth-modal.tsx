'use client'

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth-store";
import { Loader2 } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-[#FAF7F2] border-[#C9BBA3] rounded-none">
        {/* AuthForm is conditionally rendered so it remounts when modal reopens,
            resetting all form state via useState initializers. */}
        {open && <AuthForm onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

interface AuthFormProps {
  onClose: () => void;
}

function AuthForm({ onClose }: AuthFormProps) {
  const { signIn, signUp, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (mode === "signup") {
      const { error } = await signUp(email, password, fullName || undefined);
      if (error) {
        setError(error);
        return;
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        return;
      }
    }

    onClose();
  };

  return (
    <div className="p-6 md:p-8">
      <DialogHeader className="p-0 text-left mb-6">
        <DialogTitle className="font-serif text-2xl font-bold text-[#1A1614] p-0">
          {mode === "login" ? "Welcome back." : "Create your account."}
        </DialogTitle>
        <DialogDescription className="text-sm text-[#6E6258] p-0">
          {mode === "login"
            ? "Sign in to view your orders and sync your cart across devices."
            : "Get faster checkout, order history, and cart sync across devices."}
        </DialogDescription>
      </DialogHeader>

      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as "login" | "signup")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 bg-[#F2EDE4] rounded-none">
          <TabsTrigger
            value="login"
            className="rounded-none data-[state=active]:bg-[#1A1614] data-[state=active]:text-[#FAF7F2] data-[state=active]:shadow-none text-xs font-semibold uppercase tracking-[0.14em]"
          >
            Sign In
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="rounded-none data-[state=active]:bg-[#1A1614] data-[state=active]:text-[#FAF7F2] data-[state=active]:shadow-none text-xs font-semibold uppercase tracking-[0.14em]"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="brand-eyebrow text-[#6E6258]">
                Email
              </Label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="h-11 bg-[#FAF7F2] border-[#C9BBA3] text-[#1A1614] placeholder:text-[#6E6258] rounded-none focus-visible:ring-[#8B5A3C]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password" className="brand-eyebrow text-[#6E6258]">
                Password
              </Label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-11 bg-[#FAF7F2] border-[#C9BBA3] text-[#1A1614] placeholder:text-[#6E6258] rounded-none focus-visible:ring-[#8B5A3C]"
              />
            </div>
            {error && (
              <p className="text-xs text-[#90534D] font-medium bg-[#F2EDE4] border border-[#C9BBA3] px-3 py-2">
                {error}
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full h-11 bg-[#1A1614] text-[#FAF7F2] hover:bg-[#8B5A3C] rounded-none gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup" className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name" className="brand-eyebrow text-[#6E6258]">
                Full Name (optional)
              </Label>
              <Input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="h-11 bg-[#FAF7F2] border-[#C9BBA3] text-[#1A1614] placeholder:text-[#6E6258] rounded-none focus-visible:ring-[#8B5A3C]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="brand-eyebrow text-[#6E6258]">
                Email
              </Label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="h-11 bg-[#FAF7F2] border-[#C9BBA3] text-[#1A1614] placeholder:text-[#6E6258] rounded-none focus-visible:ring-[#8B5A3C]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="brand-eyebrow text-[#6E6258]">
                Password (min 6 chars)
              </Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-11 bg-[#FAF7F2] border-[#C9BBA3] text-[#1A1614] placeholder:text-[#6E6258] rounded-none focus-visible:ring-[#8B5A3C]"
              />
            </div>
            {error && (
              <p className="text-xs text-[#90534D] font-medium bg-[#F2EDE4] border border-[#C9BBA3] px-3 py-2">
                {error}
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full h-11 bg-[#1A1614] text-[#FAF7F2] hover:bg-[#8B5A3C] rounded-none gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <p className="mt-6 text-[10px] text-[#6E6258] text-center">
        By signing in, you agree to FORGE&apos;s Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
