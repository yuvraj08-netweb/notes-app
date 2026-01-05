"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StickyNote, LogOut, User, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface SidebarProps {
  user: {
    email: string;
    user_metadata?: {
      name?: string;
      full_name?: string;
    };
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const userName = user.user_metadata?.name || user.user_metadata?.full_name || "User";

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-300
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          w-64
          fixed lg:sticky top-0 z-50
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Close Button (Mobile) */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>

        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed && <h2 className="text-xl font-bold text-gray-800">Notes App</h2>}
          {isCollapsed && <StickyNote className="h-6 w-6 text-blue-600 mx-auto" />}
        </div>

        {/* Collapse Button (Desktop) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm z-10"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <Link
            href="/notes"
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
              pathname === "/notes"
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-50"
            } ${isCollapsed ? "justify-center" : ""}`}
            title={isCollapsed ? "Notes" : ""}
          >
            <StickyNote className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Notes</span>}
          </Link>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-3 mb-3 px-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="icon"
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
