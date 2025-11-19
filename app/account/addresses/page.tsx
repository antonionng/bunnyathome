"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/account/empty-state";
import { QuickActionMenu, type QuickAction } from "@/components/account/quick-action-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deliveryAddressSchema, type DeliveryAddressFormData } from "@/lib/validations/checkout";
import { toast } from "sonner";
import { EmptyLocationIllustration } from "@/components/icons/account-icons";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Edit, Trash2, X } from "lucide-react";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeliveryAddressFormData>({
    resolver: zodResolver(deliveryAddressSchema),
  });

  const loadAddresses = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      setAddresses(data || []);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: DeliveryAddressFormData) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("addresses").insert({
      user_id: user.id,
      line1: data.line1,
      line2: data.line2 || null,
      city: data.city,
      postcode: data.postcode,
      delivery_instructions: data.deliveryInstructions || null,
      is_default: false,
    });

    if (error) {
      toast.error("Eish, couldn't add that address");
      return;
    }

    toast.success("Address stashed, bru!");
    reset();
    setShowForm(false);
    loadAddresses();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Chuck this address?")) return;

    const { error } = await supabase.from("addresses").delete().eq("id", id);

    if (error) {
      toast.error("Couldn't delete that, try again");
      return;
    }

    toast.success("Address scrapped!");
    loadAddresses();
  };

  const handleSetDefault = async (id: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Unset all defaults
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);

    // Set new default
    const { error } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id);

    if (error) {
      toast.error("Couldn't set that as main");
      return;
    }

    toast.success("Main address sorted!");
    loadAddresses();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Where We're Dropping</h1>
          <p className="mt-2 text-ink-muted">Sort out where your bunny chow boxes land, bru</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            "Add new spot"
          )}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border-2 border-black bg-white p-6 shadow-lg"
          >
            <h3 className="mb-4 text-lg font-bold text-ink">Add a new delivery spot</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="line1" required>
                  Address Line 1
                </Label>
                <Input
                  id="line1"
                  error={errors.line1?.message}
                  {...register("line1")}
                />
              </div>
              <div>
                <Label htmlFor="line2">Address Line 2</Label>
                <Input id="line2" error={errors.line2?.message} {...register("line2")} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="city" required>
                    City
                  </Label>
                  <Input id="city" error={errors.city?.message} {...register("city")} />
                </div>
                <div>
                  <Label htmlFor="postcode" required>
                    Postcode
                  </Label>
                  <Input
                    id="postcode"
                    error={errors.postcode?.message}
                    {...register("postcode")}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="deliveryInstructions">Delivery notes (if you need to tell us something)</Label>
                <Textarea
                  id="deliveryInstructions"
                  placeholder="Like 'Just chuck it by the gate' or 'Ring twice, boet'"
                  error={errors.deliveryInstructions?.message}
                  {...register("deliveryInstructions")}
                />
              </div>
              <Button type="submit">Save this spot</Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {addresses.length > 0 ? (
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
          {addresses.map((address) => {
            const quickActions: QuickAction[] = [
              ...(!address.is_default
                ? [
                    {
                      label: "Set as Default",
                      icon: <Star className="h-4 w-4" />,
                      onClick: () => handleSetDefault(address.id),
                    },
                  ]
                : []),
              {
                label: "Delete",
                icon: <Trash2 className="h-4 w-4" />,
                onClick: () => handleDelete(address.id),
                variant: "danger" as const,
              },
            ];

            return (
              <motion.div
                key={address.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="group relative overflow-hidden rounded-2xl border-2 border-black bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
              >
                {/* Header with icon and actions */}
                <div className="bg-gradient-blue p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                      <MapPin className="h-6 w-6 text-brand-black" />
                    </div>
                    <QuickActionMenu actions={quickActions} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {address.is_default && (
                    <Badge variant="warning" className="mb-3">
                      <Star className="mr-1 h-3 w-3" />
                      Main spot
                    </Badge>
                  )}

                  <div className="space-y-1">
                    <p className="font-bold text-ink">{address.line1}</p>
                    {address.line2 && (
                      <p className="text-sm text-ink-muted">{address.line2}</p>
                    )}
                    <p className="text-sm text-ink-muted">
                      {address.city}, {address.postcode}
                    </p>
                  </div>

                  {address.delivery_instructions && (
                    <div className="mt-4 rounded-lg border-2 border-black/10 bg-gray-50 p-3">
                      <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                        Drop-off Note
                      </p>
                      <p className="mt-1 text-sm text-ink">
                        {address.delivery_instructions}
                      </p>
                    </div>
                  )}
                </div>

                {/* Hover Indicator */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  className="absolute bottom-0 left-0 right-0 h-1 origin-left bg-brand-blue"
                />
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        !showForm && (
          <EmptyState
            icon={<EmptyLocationIllustration className="h-full w-full" />}
            title="Eish, nowhere to drop!"
            description="Tell us where to send the bunny chow, bru"
            action={{
              label: "Add your first address",
              onClick: () => setShowForm(true),
            }}
          />
        )
      )}
    </div>
  );
}

