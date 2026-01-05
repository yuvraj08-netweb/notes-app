"use client";


import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      onClick={() => supabase.auth.signOut()}
    >
      Logout
    </Button>
  );
}
