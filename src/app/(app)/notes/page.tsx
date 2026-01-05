import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import NotesClient from "./NotesClient";

export default async function NotesPage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="p-4 pt-16 lg:p-8 lg:pt-8">
      <NotesClient userId={user.id} />
    </main>
  );
}
