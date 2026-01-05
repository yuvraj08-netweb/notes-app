"use client";

import type PouchDB from "pouchdb";

export async function createNotesDB(userId: string) {
  const PouchDBConstructor = (await import("pouchdb"))
    .default as typeof PouchDB;

  return new PouchDBConstructor(`notes_${userId}`);
}
