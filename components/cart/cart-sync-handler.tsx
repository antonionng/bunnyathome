"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cart-store";
import { createClient } from "@/lib/supabase/client";

/**
 * Component that handles automatic cart syncing when user logs in/out
 * Should be rendered once at the app level (in layout)
 */
export function CartSyncHandler() {
  const syncWithServer = useCartStore((state) => state.syncWithServer);
  const loadFromServer = useCartStore((state) => state.loadFromServer);
  const hasSynced = useRef(false);
  const supabase = createClient();

  useEffect(() => {
    // Check current auth state and load cart if logged in
    const checkAuthAndSync = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && !hasSynced.current) {
        // User is logged in, merge local cart with server cart
        await syncWithServer(user.id, true);
        hasSynced.current = true;
      }
    };

    checkAuthAndSync();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // User just logged in - merge local cart with server
        await syncWithServer(session.user.id, true);
        hasSynced.current = true;
      } else if (event === "SIGNED_OUT") {
        // User logged out - reset sync flag
        hasSynced.current = false;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, syncWithServer, loadFromServer]);

  // Also sync periodically for logged in users
  useEffect(() => {
    const interval = setInterval(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await syncWithServer(user.id, false); // Don't merge, just save
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [supabase, syncWithServer]);

  return null; // This component doesn't render anything
}

