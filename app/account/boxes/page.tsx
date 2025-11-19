"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/account/empty-state";
import { QuickActionMenu, type QuickAction } from "@/components/account/quick-action-menu";
import { formatFromPence } from "@/lib/currency";
import { format } from "date-fns";
import { EmptyBoxIllustration } from "@/components/icons/account-icons";
import { toast } from "sonner";
import { ConfirmDialog, useConfirmDialog } from "@/components/ui/confirm-dialog";
import { motion } from "framer-motion";
import { ShoppingCart, Edit, Trash2, Package, Flame } from "lucide-react";

export default function SavedBoxesPage() {
  const router = useRouter();
  const [boxes, setBoxes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const addFromBuilder = useCartStore((state) => state.addFromBuilder);
  const { confirm, dialogProps } = useConfirmDialog();

  useEffect(() => {
    const loadBoxes = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("saved_boxes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setBoxes(data || []);
      }

      setIsLoading(false);
    };

    loadBoxes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteBox = (boxId: string) => {
    confirm({
      title: "Scrap this box?",
      description: "This will permanently delete this saved box. You can always make a new one though, bru.",
      confirmText: "Yeah, scrap it",
      cancelText: "Keep it",
      variant: "danger",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/boxes/${boxId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            setBoxes(boxes.filter((b) => b.id !== boxId));
            toast.success("Box scrapped successfully");
          } else {
            throw new Error("Failed to delete box");
          }
        } catch (error) {
          toast.error("Eish, couldn't scrap that box", {
            description: "Give it another bash, bru.",
          });
        }
      },
    });
  };

  const handleReorder = async (boxId: string) => {
    try {
      const response = await fetch(`/api/boxes/${boxId}/reorder`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to reorder");
      }

      const { configuration } = await response.json();

      // Add to cart using the configuration
      // Note: This requires the product catalog - you'd need to fetch it
      // For now, redirect to builder with the box ID
      router.push(`/builder?loadBox=${boxId}`);
      
      toast.success("Loading your saved box!", {
        description: "Taking you to the builder, sharp sharp",
      });
    } catch (error) {
      toast.error("Eish, couldn't load that box", {
        description: "Give it another bash, bru.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getBoxCategory = (configuration: any): string[] => {
    // Simple logic to categorize boxes - extend based on actual data structure
    const categories = [];
    if (configuration?.spiceLevel > 3) categories.push("Spicy");
    if (configuration?.hasVeggie) categories.push("Veggie");
    if (configuration?.hasMeat) categories.push("Meat Feast");
    return categories;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Your Saved Boxes</h1>
          <p className="mt-2 text-ink-muted">
            All your lekker combos ready to order again, sharp sharp
          </p>
        </div>
        <Button asChild>
          <Link href="/builder">Build a new one</Link>
        </Button>
      </div>

      {boxes.length > 0 ? (
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
          {boxes.map((box) => {
            const categories = getBoxCategory(box.configuration);
            const quickActions: QuickAction[] = [
              {
                label: "Quick Add to Cart",
                icon: <ShoppingCart className="h-4 w-4" />,
                onClick: () => handleReorder(box.id),
              },
              {
                label: "Edit Box",
                icon: <Edit className="h-4 w-4" />,
                onClick: () => router.push(`/builder?loadBox=${box.id}`),
              },
              {
                label: "Delete",
                icon: <Trash2 className="h-4 w-4" />,
                onClick: () => handleDeleteBox(box.id),
                variant: "danger",
              },
            ];

            return (
              <motion.div
                key={box.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="group relative overflow-hidden rounded-2xl border-2 border-black bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
              >
                {/* Thumbnail Area */}
                <div className="relative h-40 bg-gradient-curry p-4">
                  <div className="absolute right-3 top-3">
                    <QuickActionMenu actions={quickActions} />
                  </div>
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-16 w-16 text-brand-black opacity-50" />
                  </div>
                  {/* Category Tags */}
                  {categories.length > 0 && (
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      {categories.map((cat, i) => (
                        <Badge key={i} variant="warning" className="text-xs">
                          {cat === "Spicy" && <Flame className="mr-1 h-3 w-3" />}
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-4">
                    <h3 className="mb-1 text-xl font-bold text-ink">{box.name}</h3>
                    {box.description && (
                      <p className="text-sm text-ink-muted">{box.description}</p>
                    )}
                  </div>

                  <div className="mb-4 rounded-lg border-2 border-black/10 bg-brand-curry/10 p-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                      What it'll cost
                    </p>
                    <p className="mt-1 text-2xl font-bold text-ink">
                      {formatFromPence(box.total_price)}
                    </p>
                  </div>

                  <p className="mb-4 text-xs text-ink-muted">
                    Stashed on {format(new Date(box.created_at), "MMM d, yyyy")}
                  </p>

                  <Button
                    className="w-full"
                    onClick={() => handleReorder(box.id)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Order this again
                  </Button>
                </div>

                {/* Hover Indicator */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  className="absolute bottom-0 left-0 right-0 h-1 origin-left bg-brand-curry"
                />
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <EmptyState
          icon={<EmptyBoxIllustration className="h-full w-full" />}
          title="Eish, nothing saved yet!"
          description="Sort out a proper bunny box and stash it here for next time, bru"
          action={{
            label: "Build your first box",
            href: "/builder",
          }}
        />
      )}
      
      <ConfirmDialog {...dialogProps} />
    </div>
  );
}

