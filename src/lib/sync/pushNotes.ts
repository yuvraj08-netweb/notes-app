"use client";

import { supabase } from "@/lib/supabase/client";
import { createNotesDB } from "@/lib/pouch/createDB";
import type { StoredNoteDoc } from "@/lib/pouch/types";

export async function pushNotes(userId: string) {
  const db = await createNotesDB(userId);

  const result = await db.allDocs<StoredNoteDoc>({
    include_docs: true,
  });

  const notes = result.rows.flatMap((r) => (r.doc ? [r.doc] : []));

  if (notes.length === 0) return;

  const payload = notes.map((note) => ({
    id: note._id,
    user_id: userId,
    title: note.title,
    content: note.content,
    updated_at: note.updatedAt,
    deleted: false,
  }));

  await supabase.from("notes").upsert(payload, {
    onConflict: "id",
  });
}
