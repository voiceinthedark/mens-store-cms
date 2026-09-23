import React from "react";
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Package,
} from "lucide-react";
import { CMSLayout } from "../components/layout/CMSLayout";

export const DashboardPage: React.FC = () => {
  // Sample KPI metrics (would connect to analytics/order service endpoints)
  const stats = [
    {
      label: "Total Revenue",
      value: "$12,480.00",
      change: "+14%",
      icon: DollarSign,
    },
    {
      label: "Orders Processed",
      value: "84",
      change: "+8%",
      icon: ShoppingBag,
    },
    {
      label: "Active Products",
      value: "42",
      change: "In catalog",
      icon: Package,
    },
    {
      label: "Low Stock Items",
      value: "3",
      change: "Requires action",
      icon: AlertTriangle,
      warning: true,
    },
  ];

  const recentOrders = [
    {
      id: "ORD-9021",
      customer: "Alexander Vance",
      item: "Italian Wool Suit (40R)",
      status: "Processing",
      total: "$450.00",
    },
    {
      id: "ORD-9020",
      customer: "Marcus Sterling",
      item: "Oxford Cotton Shirt (M)",
      status: "Shipped",
      total: "$85.00",
    },
    {
      id: "ORD-9019",
      customer: "David Miller",
      item: "Leather Chelsea Boots (10)",
      status: "Delivered",
      total: "$210.00",
    },
  ];

  return (
    <CMSLayout>
      <div className="space-y-8">
        {/* Dashboard Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Store Analytics
          </h1>
          <p className="text-sm text-gray-500">
            Real-time overview of your men's apparel performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-gray-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div
                  className={`p-2 rounded-lg ${stat.warning ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`}
                >
                  <stat.icon size={18} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p
                  className={`text-xs mt-1 font-medium ${stat.warning ? "text-amber-600" : "text-green-600"}`}
                >
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Low Stock Alert Banner */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-amber-600" size={20} />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                3 product variants are running low on stock
              </p>
              <p className="text-xs text-amber-700">
                Check inventory to prevent missed sales
              </p>
            </div>
          </div>
          <a
            href="/products"
            className="text-xs font-semibold text-amber-900 hover:underline flex items-center gap-1"
          >
            Review Stock <ArrowRight size={14} />
          </a>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-xl border border-gray-200 space-y-4 p-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <a
              href="/orders"
              className="text-xs font-semibold text-gray-600 hover:text-black flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </a>
          </div>

          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {order.id} — {order.customer}
                  </p>
                  <p className="text-xs text-gray-500">{order.item}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 text-sm">
                  <span className="font-semibold text-gray-900">
                    {order.total}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CMSLayout>
  );
};
