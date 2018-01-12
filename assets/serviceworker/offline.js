const offlinePage = '{{offline_page}}';
const staticCachePages = {{cached_pages}};
const key = 'ProgressiveWordPress';
const staticCacheName = `${key}-Static-${version}`;

/**
 * INSTALL
 * cache predefined pages
 */

self.addEventListener('install', event => {

	// install offline pages
	event.waitUntil(
		caches.open(staticCacheName)
			.then(cache => {
				return cache.addAll(staticCachePages);
			})
			.then(function () {
				return self.skipWaiting();
			})
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys()
			.then(keys => {
				return Promise.all(
					keys.map(key => {
						if (key !== staticCacheName) {
							return caches.delete(key);
						}
					})
				);
			})
	);
});

/**
 * HANDLE FETCH
 */

self.addEventListener('fetch', event => {

	let request = event.request;
	let url = new URL(request.url);

	// only deal with requests on the same domain.
	if (url.origin !== location.origin) {
		return;
	}

	//don't do anything if wp stuff
	if (request.url.match(/wp-admin/) || request.url.match(/preview=true/)) {
		return;
	}

	// If non-GET request, try the network first, fall back to the offline page
	if (request.method !== 'GET') {
		event.respondWith(
			fetch(request)
				.catch(error => {
					return caches.match(offlinePage);
				})
		);
		return;
	}

	// Try the network first (and update cache), fall back to the cache, finally the offline page
	event.respondWith(
		fetch(request)
			.then(response => {
				addToCache(request);
				return response;
			})
			.catch(error => {
				return caches.match(request)
					.then(response => {
						return response || caches.match(offlinePage);
					});
			})
	);

	const addToCache = function (request) {
		return caches.open(staticCacheName)
			.then(cache => {
				return fetch(request)
					.then(response => {
						return cache.put(request, response);
					});
			});
	};
});