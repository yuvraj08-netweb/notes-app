// src/app/(auth)/signup/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/notes");
    }
  }, [user, loading, router]);

  const handleSignup = async () => {
    setSubmitting(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace("/notes");
  };

  if (loading) return <p className="p-6">Checking session…</p>;
  if (user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Create account</h1>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSignup()}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSignup()}
        />

        <Button
          className="w-full"
          onClick={handleSignup}
          disabled={submitting}
        >
          {submitting ? "Creating account…" : "Sign up"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-foreground hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
