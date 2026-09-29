// filepath: apps/cms/src/components/ui/DesktopSideBar.tsx

import React from "react";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import type { AuthUser } from "../../api/client";

interface DesktopSideBarProps {
  navItems: { label: string; icon: React.ElementType; href: string }[];
  user?: AuthUser | null;
  onLogout?: () => void;
}

export const DesktopSideBar: React.FC<DesktopSideBarProps> = ({
  navItems,
  user,
  onLogout,
}) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">
        Avantaria CMS
      </h1>
      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>

      {user && (
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      )}
    </aside>
  );
};
