// filepath: apps/cms/src/components/ui/MobileTopNavigation.tsx

import React from "react";
import { Menu, X } from "lucide-react";

interface MobileTopNavigationProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const MobileTopNavigation: React.FC<MobileTopNavigationProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  return (
    <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-40">
      <h1 className="text-xl font-bold tracking-tight text-gray-900">
        Avantaria Admin
      </h1>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </header>
  );
};
