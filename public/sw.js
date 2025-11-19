const CACHE_NAME = "bunny-at-home-v1";
const STATIC_ASSETS = [
  "/offline",
  "/logo.png",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();

        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Return offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/offline");
          }

          return new Response("Network error", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          });
        });
      })
  );
});

// Background sync for cart
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-cart") {
    event.waitUntil(syncCart());
  }
});

async function syncCart() {
  try {
    // Get cart data from IndexedDB or localStorage
    const cartData = await getCartData();

    if (
      !cartData ||
      !Array.isArray(cartData.items) ||
      cartData.items.length === 0
    ) {
      return;
    }
    
    // Sync with server
    const response = await fetch("/api/cart/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartData }),
    });

    if (response.ok) {
      console.log("Cart synced successfully");
    }
  } catch (error) {
    console.error("Failed to sync cart:", error);
  }
}

async function getCartData() {
  // Try to get from localStorage
  try {
    const stored = localStorage.getItem("bunny-cart");
    if (stored) {
      const parsed = JSON.parse(stored);
      const state = parsed?.state;
      if (state && Array.isArray(state.items)) {
        return {
          items: state.items,
          promoCode: state.promoCode || null,
        };
      }
    }
  } catch (error) {
    console.error("Failed to get cart data:", error);
  }
  return null;
}

// Push notifications
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  
  const title = data.title || "Bunny At Home";
  const options = {
    body: data.body || "You have a new notification",
    icon: "/logo.png",
    badge: "/logo.png",
    data: data.url || "/",
    tag: data.tag || "default",
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data || "/")
  );
});

