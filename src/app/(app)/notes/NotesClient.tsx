"use client";

import { useEffect, useState } from "react";
import type { StoredNoteDoc } from "@/lib/pouch/types";
import { getAllNotes, createNote } from "@/lib/pouch/notes";
import { syncNotes } from "@/lib/sync/syncNotes";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  RefreshCw,
  FileText,
  Wifi,
  WifiOff,
  Calendar,
  StickyNote,
} from "lucide-react";

export default function NotesClient({ userId }: { userId: string }) {
  const [notes, setNotes] = useState<StoredNoteDoc[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<StoredNoteDoc | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (userId) {
      syncNotes(userId);
      const handleOnline = () => syncNotes(userId);
      window.addEventListener("online", handleOnline);
      return () => window.removeEventListener("online", handleOnline);
    }
  }, [userId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const data = await getAllNotes(userId);
      if (!cancelled) {
        setNotes(data);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function handleCreate() {
    if (!title.trim() && !content.trim()) return;

    setSaving(true);

    const note = await createNote(userId, {
      title,
      content,
      updatedAt: Date.now(),
    });

    // Optimistic UI
    setNotes((prev) => [note, ...prev]);

    setTitle("");
    setContent("");
    setSaving(false);
    setDialogOpen(false);
  }

  async function handleSync() {
    setSyncing(true);
    await syncNotes(userId);
    setSyncing(false);
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notes Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your notes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={isOnline ? "default" : "destructive"}
            className={`flex items-center gap-1.5 px-3 py-1.5 ${
              isOnline
                ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600"
                : "bg-red-500 hover:bg-red-600 text-white border-red-600"
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="h-3.5 w-3.5" />
                Online
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5" />
                Offline
              </>
            )}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={syncing || !isOnline}
            className="gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            Sync
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <StickyNote className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{notes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {notes.length === 1 ? "note" : "notes"} in your collection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notes Grid */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Notes
            </h2>

            <DialogTrigger asChild>
              <Button
                size="sm"
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                New
              </Button>
            </DialogTrigger>
          </div>

          {notes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <StickyNote className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-1">No notes yet</h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Get started by creating your first note above. Your notes will
                  sync across devices automatically.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <Card
                  key={note._id}
                  onClick={() => {
                    setSelectedNote(note);
                    setViewDialogOpen(true);
                  }}
                  className="hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
                >
                  <CardHeader>
                    <CardTitle className="line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {note.title || "Untitled"}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-xs">
                      <Calendar className="h-3 w-3 text-blue-500" />
                      {formatDate(note.updatedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {note.content || "No content"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <DialogContent className="sm:max-w-137.5">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>
              Add a new note to your collection. Your note will be saved automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="note-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="note-title"
                placeholder="Enter note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    document.getElementById("note-content")?.focus();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="note-content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="note-content"
                placeholder="Write your note here..."
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
              className="hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={saving || (!title.trim() && !content.trim())}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Note
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Note Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedNote?.title || "Untitled"}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Last updated: {selectedNote && formatDate(selectedNote.updatedAt)}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {selectedNote?.content || "No content"}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
              className="cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
