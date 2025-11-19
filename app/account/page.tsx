"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/account/order-card";
import { PersonalGreeting } from "@/components/account/personal-greeting";
import { StatCard } from "@/components/account/stat-card";
import { EmptyState } from "@/components/account/empty-state";
import { formatFromPence } from "@/lib/currency";
import { EmptyBoxIllustration, GiftIcon, PackageIcon } from "@/components/icons/account-icons";
import { Users } from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Load profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(profileData);

        // Load recent orders
        const { data: ordersData } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        setRecentOrders(ordersData || []);
      }

      setIsLoading(false);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Personal Greeting */}
      <PersonalGreeting 
        userName={profile?.full_name} 
        userEmail={user?.email} 
      />

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <StatCard
          title="Your Points, Bru"
          value={profile?.points_balance || 0}
          subtitle={`That's ${formatFromPence((profile?.points_balance || 0))} in rewards`}
          icon={<GiftIcon className="h-6 w-6 text-brand-black" />}
          gradient="curry"
          link={{
            href: "/account/rewards",
            label: "Check rewards, sharp sharp",
          }}
          delay={0}
        />

        <StatCard
          title="Boxes Sorted"
          value={recentOrders.length}
          subtitle={`${recentOrders.length} ${recentOrders.length === 1 ? 'order' : 'orders'} delivered`}
          icon={<PackageIcon className="h-6 w-6 text-brand-black" />}
          gradient="blue"
          link={{
            href: "/account/orders",
            label: "See them all",
          }}
          delay={0.1}
        />

        <StatCard
          title="Hook Up Your Chommies"
          value={profile?.referral_code || "N/A"}
          subtitle="Share your code for rewards"
          icon={<Users className="h-6 w-6 text-brand-black" />}
          gradient="green"
          link={{
            href: "/account/referrals",
            label: "Start referring",
          }}
          delay={0.2}
        />
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-ink">What you've been ordering</h2>
            <Link
              href="/account/orders"
              className="text-sm font-bold text-brand-coral hover:underline"
            >
              See everything
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<EmptyBoxIllustration className="h-full w-full" />}
          title="Eish, no orders yet!"
          description="Time to sort your first proper Durban bunny chow box, bru. Let's make it lekker!"
          action={{
            label: "Build your box, sharp sharp",
            href: "/builder",
          }}
        />
      )}
    </div>
  );
}

