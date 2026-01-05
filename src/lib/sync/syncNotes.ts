"use client";

import { pushNotes } from "./pushNotes";
import { pullNotes } from "./pullNotes";

export async function syncNotes(userId: string) {
  await pushNotes(userId);
  await pullNotes(userId);
}
