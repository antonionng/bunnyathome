"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { deliveryAddressSchema, type DeliveryAddressFormData } from "@/lib/validations/checkout";
import { useCheckoutStore } from "@/store/checkout-store";
import { CheckoutStepper } from "@/components/checkout/checkout-stepper";
import { OrderSummary } from "@/components/checkout/order-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner, LoadingOverlay } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

export default function DeliveryPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const deliveryAddress = useCheckoutStore((state) => state.deliveryAddress);
  const saveAddress = useCheckoutStore((state) => state.saveAddress);
  const guestEmail = useCheckoutStore((state) => state.guestEmail);
  const setDeliveryAddress = useCheckoutStore((state) => state.setDeliveryAddress);
  const setSaveAddress = useCheckoutStore((state) => state.setSaveAddress);
  const setGuestEmail = useCheckoutStore((state) => state.setGuestEmail);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DeliveryAddressFormData>({
    resolver: zodResolver(deliveryAddressSchema),
    defaultValues: deliveryAddress || undefined,
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: addresses } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false });

        if (addresses) {
          setSavedAddresses(addresses);
        }
      }

      setIsLoading(false);
    };

    loadData();
  }, [supabase]);

  const onSubmit = async (data: DeliveryAddressFormData) => {
    // Validate guest email if not logged in
    if (!user && !guestEmail) {
      toast.error("Email required", {
        description: "Please provide your email for order updates.",
      });
      return;
    }

    setDeliveryAddress(data);

    // Save address if checkbox is checked and user is logged in
    if (saveAddress && user) {
      try {
        await supabase.from("addresses").insert({
          user_id: user.id,
          line1: data.line1,
          line2: data.line2 || null,
          city: data.city,
          postcode: data.postcode,
          delivery_instructions: data.deliveryInstructions || null,
          is_default: false,
        });
        toast.success("Address saved successfully!");
      } catch (error) {
        console.error("Failed to save address:", error);
      }
    }

    router.push("/checkout/schedule");
  };

  const handleSelectAddress = (address: any) => {
    setValue("line1", address.line1);
    setValue("line2", address.line2 || "");
    setValue("city", address.city);
    setValue("postcode", address.postcode);
    setValue("deliveryInstructions", address.delivery_instructions || "");
  };

  if (isLoading) {
    return <LoadingOverlay message="Loading your saved addresses..." />;
  }

  return (
    <div className="space-y-8">
      <CheckoutStepper currentStep="delivery" />

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-black bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-xl font-bold text-ink">Delivery Address</h2>

            {/* Guest email field */}
            {!user && (
              <div className="mb-6">
                <Label htmlFor="guestEmail" required>
                  Email for Order Updates
                </Label>
                <Input
                  id="guestEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={guestEmail || ""}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                />
                <p className="mt-1 text-xs text-ink-muted">
                  We'll send your order confirmation and tracking info here
                </p>
              </div>
            )}

            {savedAddresses.length > 0 && user && (
              <div className="mb-6">
                <Label>Saved Addresses</Label>
                <div className="mt-2 space-y-2">
                  {savedAddresses.map((address) => (
                    <button
                      key={address.id}
                      onClick={() => handleSelectAddress(address)}
                      className="w-full rounded-lg border-2 border-black bg-white p-4 text-left transition-colors hover:bg-gray-50"
                    >
                      <p className="font-bold text-ink">{address.line1}</p>
                      {address.line2 && (
                        <p className="text-sm text-ink-muted">{address.line2}</p>
                      )}
                      <p className="text-sm text-ink-muted">
                        {address.city}, {address.postcode}
                      </p>
                      {address.is_default && (
                        <span className="mt-2 inline-block rounded-full bg-brand-curry px-2 py-1 text-xs font-bold">
                          Default
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-300" />
                  <span className="text-sm text-ink-muted">or enter a new address</span>
                  <div className="h-px flex-1 bg-gray-300" />
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label htmlFor="line1" required>
                  Address Line 1
                </Label>
                <Input
                  id="line1"
                  placeholder="123 Main Street"
                  error={errors.line1?.message}
                  {...register("line1")}
                />
              </div>

              <div>
                <Label htmlFor="line2">Address Line 2</Label>
                <Input
                  id="line2"
                  placeholder="Apartment, suite, etc. (optional)"
                  error={errors.line2?.message}
                  {...register("line2")}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <Label htmlFor="city" required>
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="London"
                    error={errors.city?.message}
                    {...register("city")}
                  />
                </div>

                <div>
                  <Label htmlFor="postcode" required>
                    Postcode
                  </Label>
                  <Input
                    id="postcode"
                    placeholder="SW1A 1AA"
                    error={errors.postcode?.message}
                    {...register("postcode")}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deliveryInstructions">Delivery Instructions</Label>
                <Textarea
                  id="deliveryInstructions"
                  placeholder="e.g., 'Leave by the front door' or 'Ring doorbell twice'"
                  error={errors.deliveryInstructions?.message}
                  {...register("deliveryInstructions")}
                />
              </div>

              {user && (
                <Checkbox
                  id="saveAddress"
                  label="Save this address for future orders"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                />
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => router.push("/cart")}
                >
                  Back to Cart
                </Button>
                <Button type="submit" size="lg" className="flex-1">
                  Continue
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-lg section-border-pink">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}


