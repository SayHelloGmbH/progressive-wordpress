import Bowser from 'bowser';

export const untrailingSlashIt = (str: string): string =>
  str.replace(/\/$/, '');

export const trailingSlashIt = (str: string): string =>
  untrailingSlashIt(str) + '/';

export const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const getServiceWorkerRegistration = (): Promise<ServiceWorkerRegistration> =>
  navigator.serviceWorker.getRegistration();

export const getPushManagerSubscription = (): Promise<PushSubscription> =>
  getServiceWorkerRegistration().then((registration) =>
    registration.pushManager.getSubscription()
  );

export const getPushPermission = (): Promise<PermissionStatus> =>
  navigator.permissions.query({
    userVisibleOnly: true,
    name: 'push',
  });

export const isPushManagerSupported = (): boolean =>
  'serviceWorker' in navigator && 'PushManager' in window;

export const getClientData = (): ClientDataI => {
  const client = Bowser.getParser(window.navigator.userAgent);

  const browser = client.getBrowser();
  const os = client.getOS();
  const platform = client.getPlatform();
  return {
    browser: {
      browser: browser.name || '',
      version: browser.version || '',
    },
    os: {
      os: os.name || '',
      version: os.versionName || '',
    },
    platform: {
      type: platform.type || '',
      vendor: platform.vendor || '',
      model: platform.model || '',
    },
  };
};
