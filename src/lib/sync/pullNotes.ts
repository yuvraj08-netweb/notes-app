"use client";

import { supabase } from "@/lib/supabase/client";
import { createNotesDB } from "@/lib/pouch/createDB";
import type { StoredNoteDoc, NoteDoc } from "@/lib/pouch/types";

export async function pullNotes(userId: string) {
  const db = await createNotesDB(userId);

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .eq("deleted", false);

  if (error || !data) {
    console.error(error);
    return;
  }

  for (const remote of data) {
    let local: StoredNoteDoc | null = null;

    try {
      local = (await db.get(remote.id)) as StoredNoteDoc;
    } catch {
      local = null;
    }

    // Only overwrite if remote is newer
    if (!local || remote.updated_at > local.updatedAt) {
      const baseDoc: NoteDoc = {
        _id: remote.id,
        title: remote.title,
        content: remote.content,
        updatedAt: remote.updated_at,
      };

      // If local exists, keep _rev
      if (local?._rev) {
        await db.put({
          ...baseDoc,
          _rev: local._rev,
        });
      } else {
        await db.put(baseDoc);
      }
    }
  }
}
