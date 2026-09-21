const BASE = '/libros-reader-web/';
const CACHE = 'lectorlibros-shell-v3.1.0';
const PRECACHE = [
  BASE,
  `${BASE}index.html`,
  `${BASE}login.html`,
  `${BASE}reader.html`,
  `${BASE}settings.html`,
  `${BASE}stats.html`,
  `${BASE}manifest.webmanifest`,
  `${BASE}icon-192.png`,
  `${BASE}icon-512.png`,
  `${BASE}_expo/static/js/web/entry-4b79474557daf0343e10611000bfeb48.js`,
  `${BASE}assets/node_modules/@expo-google-fonts/atkinson-hyperlegible/400Regular/AtkinsonHyperlegible_400Regular.59f0f5543754fa6b68a563036eafaaab.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/atkinson-hyperlegible/700Bold/AtkinsonHyperlegible_700Bold.f2193e9c742b9554852a3000f0ccdc9c.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/fraunces/600SemiBold/Fraunces_600SemiBold.e995588822b0867215ce518a9a79175b.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/fraunces/600SemiBold_Italic/Fraunces_600SemiBold_Italic.d3386675410283c88aedd87637eb5741.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/fraunces/700Bold/Fraunces_700Bold.0c859ce19af0584bccfc6941addedf34.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.51b6ad87261f18b6433ec52871ddfabc.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.137ab18bace28dd0bd83eb3b8ed2bc54.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.a5f35888d2da465de352e0dcfaf33324.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.6e237de4f1f413afa2fcc45c77ac343a.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/literata/400Regular/Literata_400Regular.618ebf4b50ba721ead138e34816bd690.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/literata/400Regular_Italic/Literata_400Regular_Italic.4127f1733b346ebd6a2a65057a6af81f.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/literata/700Bold/Literata_700Bold.d58b551067ef269cfb14dafeaf12ea2f.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/lora/400Regular/Lora_400Regular.7637dfac7457920e0367967d608ee3a8.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/lora/400Regular_Italic/Lora_400Regular_Italic.23b1466fb9df366dc42831381cdce668.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/lora/700Bold/Lora_700Bold.a487e58050c7a815e9e5cc2d70a8f3ae.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/merriweather/400Regular/Merriweather_400Regular.8796bb346ed9b0096d632f664d30f48e.ttf`,
  `${BASE}assets/node_modules/@expo-google-fonts/merriweather/700Bold/Merriweather_700Bold.1a5e611cc45498c12481775c91f900c1.ttf`,
  `${BASE}assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.b4eb097d35f44ed943676fd56f6bdc51.ttf`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.allSettled(PRECACHE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('lectorlibros-shell-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response.ok) throw new Error(`Navigation failed (${response.status})`);
          caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
          return response;
        })
        .catch(async () =>
          (await caches.match(request))
          || (await caches.match(`${BASE}index.html`))
          || (await caches.match(BASE))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
        return response;
      });
    })
  );
});
