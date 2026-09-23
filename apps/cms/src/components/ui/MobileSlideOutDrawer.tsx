// filepath: apps/cms/src/components/ui/MobileSlideOutDrawer.tsx

import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ShoppingCart,
} from "lucide-react";

interface MobileSlideOutDrawerProps {
  navItems: { label: string; icon: React.ElementType; href: string }[];
  setMobileMenuOpen: (open: boolean) => void;
}

export const MobileSlideOutDrawer: React.FC<MobileSlideOutDrawerProps> = ({
  navItems,
  setMobileMenuOpen,
}) => {
  return (
    <div
      className="md:hidden fixed inset-0 z-30 bg-black/50"
      onClick={() => setMobileMenuOpen(false)}
    >
      <div
        className="w-64 bg-white h-full p-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
          Navigation
        </p>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            >
              <item.icon size={20} />
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};
