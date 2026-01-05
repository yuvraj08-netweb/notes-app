"use client";

import PouchDB from "pouchdb-browser";
import type { NoteDoc } from "./types";

export function getNotesDB(userId: string) {
  return new PouchDB<NoteDoc>(`notes_${userId}`);
}
