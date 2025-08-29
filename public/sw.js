const CACHE_NAME = 'trackhq-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/goals',
  '/mindfulness',
  '/community',
  '/analytics',
  '/coach',
  '/manifest.json',
  // Add static assets
  '/_next/static/css/',
  '/_next/static/js/',
  // Add icons when created
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('TrackHQ: Cache opened');
        return cache.addAll(urlsToCache.filter(url => !url.includes('_next')));
      })
      .catch((error) => {
        console.log('TrackHQ: Cache install failed', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it's a stream
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('TrackHQ: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for workout data
self.addEventListener('sync', (event) => {
  if (event.tag === 'workout-sync') {
    event.waitUntil(syncWorkoutData());
  }
});

async function syncWorkoutData() {
  try {
    // Get pending workout data from IndexedDB or localStorage
    const pendingWorkouts = JSON.parse(localStorage.getItem('pendingWorkouts') || '[]');
    
    if (pendingWorkouts.length > 0) {
      // Sync with server when online
      console.log('TrackHQ: Syncing workout data', pendingWorkouts.length);
      // Clear pending workouts after successful sync
      localStorage.removeItem('pendingWorkouts');
    }
  } catch (error) {
    console.log('TrackHQ: Workout sync failed', error);
  }
}
