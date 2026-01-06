"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Cloud,
  Database,
  Wifi,
  WifiOff,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data.user);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-br from-background to-muted px-4">
      <div className="max-w-6xl mx-auto py-20 space-y-20">
        {/* HERO */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Local-First Notes App
            </h1>

            <p className="text-lg text-muted-foreground">
              A production-style demo showcasing offline-first architecture
              using PouchDB and Supabase. Write notes without internet and
              sync automatically when you’re back online.
            </p>

            <div className="flex gap-4 pt-4">
              {!loading && (
                isAuthenticated ? (
                  <Button asChild size="lg">
                    <Link href="/notes">
                      Go to Notes <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )
              )}
            </div>
          </div>

          {/* ANIMATED SYNC */}
          <SyncIllustration />
        </section>

        {/* FEATURES */}
        <section className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            title="Offline-First by Default"
            description="Notes are saved locally using PouchDB, ensuring zero data loss and instant interactions."
            icon={<Database />}
          />
          <FeatureCard
            title="Automatic Sync"
            description="Data syncs with Supabase on login, page reload, and when the device reconnects."
            icon={<Wifi />}
          />
          <FeatureCard
            title="Modern Stack"
            description="Built with Next.js App Router, TypeScript, shadcn/ui, and Supabase."
            icon={<Cloud />}
          />
        </section>

        {/* FOOTER */}
        <footer className="text-center text-sm text-muted-foreground">
          Built as a reference project for local-first & offline-sync patterns
        </footer>
      </div>
    </main>
  );
}

/* ------------------ Components ------------------ */

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3 font-semibold">
          <div className="text-primary">{icon}</div>
          {title}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function SyncIllustration() {
  return (
    <div className="relative flex items-center justify-center h-64">
      {/* Local DB */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute left-0 flex flex-col items-center gap-2"
      >
        <Database className="h-10 w-10 text-primary" />
        <span className="text-sm text-muted-foreground">Local DB</span>
      </motion.div>

      {/* Sync */}
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="flex flex-col items-center gap-2"
      >
        <Wifi className="h-8 w-8 text-primary" />
        <span className="text-xs text-muted-foreground">Sync</span>
      </motion.div>

      {/* Cloud */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute right-0 flex flex-col items-center gap-2"
      >
        <Cloud className="h-10 w-10 text-primary" />
        <span className="text-sm text-muted-foreground">Supabase</span>
      </motion.div>

      {/* Offline indicator */}
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute bottom-0 flex items-center gap-2 text-muted-foreground"
      >
        <WifiOff className="h-4 w-4" />
        Offline-safe
      </motion.div>
    </div>
  );
}
