"use client";

import type { NoteDoc, StoredNoteDoc } from "./types";
import { createNotesDB } from "./createDB";

export async function getAllNotes(userId: string): Promise<StoredNoteDoc[]> {
  const db = await createNotesDB(userId);

  const result = await db.allDocs<StoredNoteDoc>({
    include_docs: true,
  });

  return result.rows.flatMap((row) => (row.doc ? [row.doc] : []));
}

export async function createNote(
  userId: string,
  input: Omit<NoteDoc, "_id">
): Promise<StoredNoteDoc> {
  const db = await createNotesDB(userId);

  const doc: NoteDoc = {
    _id: crypto.randomUUID(), // browser-safe
    ...input,
  };

  const res = await db.put(doc);

  return {
    ...doc,
    _rev: res.rev,
  };
}
