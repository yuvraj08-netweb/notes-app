// Base domain model (used when creating notes)
export type NoteDoc = {
  _id: string;
  title: string;
  content: string;
  updatedAt: number; // ✅ number, not string
  deleted?: boolean;
};

// What PouchDB actually stores & returns
export type StoredNoteDoc = NoteDoc & {
  _rev: string;
};

// Supabase row (remote)
export type NoteRow = {
  id: string;
  user_id: string;

  title: string;
  content: string;

  updated_at: number;
  deleted: boolean;
};
