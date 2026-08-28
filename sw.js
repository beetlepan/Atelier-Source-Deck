{\rtf1\ansi\ansicpg950\cocoartf2907
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const CACHE_NAME = 'asd-workshop-v3';\
const PRECACHE_URLS = [\
  '/index.html',\
  '/support.html',\
  '/icons/logo.png',\
  '/icons/favicon.ico'\
];\
\
self.addEventListener('install', (event) => \{\
  event.waitUntil(\
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))\
  );\
  self.skipWaiting();\
\});\
\
self.addEventListener('activate', (event) => \{\
  event.waitUntil(\
    caches.keys().then((keys) =>\
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))\
    )\
  );\
  self.clients.claim();\
\});\
\
// Only handle requests for this site's own files. Anything cross-origin\
// (Google Sheets API, fonts, etc.) is left completely untouched so it\
// always hits the network fresh \'97 never cached, never stale.\
self.addEventListener('fetch', (event) => \{\
  const \{ request \} = event;\
  if (request.method !== 'GET') return;\
  if (new URL(request.url).origin !== self.location.origin) return;\
\
  // Network-first for HTML (so content updates show up quickly),\
  // cache-first for everything else (images, icons, etc.)\
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) \{\
    event.respondWith(\
      fetch(request)\
        .then((response) => \{\
          const}