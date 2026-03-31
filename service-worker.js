const CACHE_NAME = 'position-sizer-v1';
const RATE_CACHE_NAME = 'position-sizer-rates-v1';
const NEWS_CACHE_NAME = 'position-sizer-news-v1';

const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && 
                        cacheName !== RATE_CACHE_NAME && 
                        cacheName !== NEWS_CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Handle exchange rate API requests
    if (url.hostname === 'api.exchangerate-api.com') {
        event.respondWith(
            caches.open(RATE_CACHE_NAME).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        // Cache successful response
                        if (response.ok) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    })
                    .catch(() => {
                        // Return cached response if network fails
                        return cache.match(event.request);
                    });
            })
        );
        return;
    }
    
    // Handle Forex Factory calendar requests
    if (url.hostname === 'nfs.faireconomy.media') {
        event.respondWith(
            caches.open(NEWS_CACHE_NAME).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        // Cache successful response
                        if (response.ok) {
                            cache.put(event.request, response.clone());
                        }
                        return response;
                    })
                    .catch(() => {
                        // Return cached response if network fails
                        return cache.match(event.request);
                    });
            })
        );
        return;
    }
    
    // Handle all other requests (static assets)
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                return fetch(event.request).then(response => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }
                    
                    // Cache successful responses for static assets
                    if (event.request.method === 'GET') {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    
                    return response;
                });
            })
            .catch(() => {
                // Return offline page or basic error
                return new Response('Offline - Please check your connection', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/plain'
                    })
                });
            })
    );
});

// Message event - handle commands from main app
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            }).then(() => {
                return self.clients.matchAll();
            }).then(clients => {
                clients.forEach(client => client.postMessage({
                    type: 'CACHE_CLEARED'
                }));
            })
        );
    }
});
