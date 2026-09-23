// filepath: apps/cms/src/components/ui/DesktopSideBar.tsx

import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ShoppingCart,
} from "lucide-react";

interface DesktopSideBarProps {
  navItems: { label: string; icon: React.ElementType; href: string }[];
}

export const DesktopSideBar: React.FC<DesktopSideBarProps> = ({ navItems }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">
        Avantaria CMS
      </h1>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
          >
            <item.icon size={20} />
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
};
