import React, { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { CMSLayout } from "../components/layout/CMSLayout";
import { api, type Order } from "../api/client";

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getOrders()
      .then(setOrders)
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <CMSLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Orders
          </h1>
          <p className="text-sm text-gray-500">
            Track and manage customer purchases
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-gray-200 space-y-3">
            <ShoppingCart className="mx-auto text-gray-300" size={40} />
            <p className="text-gray-500 font-medium">No orders yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
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
        )}
      </div>
    </CMSLayout>
  );
};
