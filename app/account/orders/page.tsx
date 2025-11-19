"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { OrderCard } from "@/components/account/order-card";
import { EmptyState } from "@/components/account/empty-state";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptySearchIllustration } from "@/components/icons/account-icons";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadOrders = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setOrders(data || []);
        setFilteredOrders(data || []);
      }

      setIsLoading(false);
    };

    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchQuery]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const statusTabs = [
    { id: "all", label: "Everything", count: orders.length },
    { id: "pending", label: "Just Now", count: orders.filter(o => o.status === "pending").length },
    { id: "confirmed", label: "Confirmed", count: orders.filter(o => o.status === "confirmed").length },
    { id: "preparing", label: "Getting Sorted", count: orders.filter(o => o.status === "preparing").length },
    { id: "shipped", label: "On The Way", count: orders.filter(o => o.status === "shipped").length },
    { id: "delivered", label: "Delivered", count: orders.filter(o => o.status === "delivered").length },
    { id: "cancelled", label: "Cancelled", count: orders.filter(o => o.status === "cancelled").length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-ink">Your Orders, Boet</h1>
        <p className="mt-2 text-ink-muted">Check what's cooking and what's been delivered</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
        <Input
          placeholder="Hunt for an order number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11"
        />
      </div>

      {/* Status Tabs */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                statusFilter === tab.id
                  ? "bg-brand-curry text-brand-black shadow-md"
                  : "bg-white text-ink hover:bg-gray-50 border-2 border-black"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <Badge
                  variant={statusFilter === tab.id ? "default" : "info"}
                  className="px-2 py-0.5 text-xs"
                >
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={<EmptySearchIllustration className="h-full w-full" />}
          title="Eish, nothing here bru!"
          description={
            searchQuery || statusFilter !== "all"
              ? "Try changing your filters, maybe they're hiding somewhere"
              : "Haven't ordered anything yet? Time to get that bunny chow sorted!"
          }
          action={
            searchQuery || statusFilter !== "all"
              ? undefined
              : {
                  label: "Build your box, sharp sharp",
                  href: "/builder",
                }
          }
        />
      )}
    </div>
  );
}

