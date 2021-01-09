self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys()
			.then(keys => {
				return Promise.all(
					keys.map(key => {
						if (/^(workbox-precache)/.test(key)) {
							//console.log('wb ' + key);
						} else if (/^(pwp-([a-zA-Z0-9]{8})-([a-z]*))/.test(key)) {
							//console.log('pwp ' + key);
							if (key.indexOf(PwpSwVersion) !== 0) {
								//console.log('delete');
								return caches.delete(key);
							}
						}
					})
				);
			})
	);
});
