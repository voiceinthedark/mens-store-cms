// filepath: apps/cms/src/components/layout/CMSLayout.tsx

import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { MobileTopNavigation } from "../ui/MobileTopNavigation";
import { MobileSlideOutDrawer } from "../ui/MobileSlideOutDrawer";
import { DesktopSideBar } from "../ui/DesktopSideBar";

interface CMSLayoutProps {
  children: React.ReactNode;
}

export const CMSLayout: React.FC<CMSLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Products", icon: ShoppingBag, href: "/products" },
    { label: "Categories", icon: Layers, href: "/categories" },
    { label: "Orders", icon: ShoppingCart, href: "/orders" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Top Navigation */}
      <MobileTopNavigation
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <MobileSlideOutDrawer
          setMobileMenuOpen={setMobileMenuOpen}
          navItems={navItems}
        />
      )}

      {/* Desktop Sidebar */}
      <DesktopSideBar navItems={navItems} />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 px-4 z-40">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-black text-xs font-medium"
          >
            <item.icon size={20} />
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
};
