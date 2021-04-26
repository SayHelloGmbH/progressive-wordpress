import './push/styles.css';

import { setPushButtonState } from './push/buttonHelpers';
import {
  registerPushDevice,
  deregisterPushDevice,
} from './push/registerDevice';

setPushButtonState('hidden');

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.getRegistration().then((registration) =>
    Promise.all([
      registration,
      registration.pushManager.getSubscription(),
      navigator.permissions.query({
        userVisibleOnly: true,
        name: 'push',
      }),
    ]).then(([registration, subscription, permission]) => {
      if (permission.state === 'denied') {
        setPushButtonState('blocked');
      } else if (permission.state === 'granted') {
        setPushButtonState('granted');
        subscription == null && registerPushDevice();
      } else if (registration) {
        setPushButtonState('idle');
      }
    })
  );
}

declare global {
  interface Window {
    pwpRegisterPushDevice: () => void;
    pwpDeregisterPushDevice: () => void;
  }
}

window.pwpRegisterPushDevice = registerPushDevice;
window.pwpDeregisterPushDevice = deregisterPushDevice;
