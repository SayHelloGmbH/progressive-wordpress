import './push/styles.css';

import { setPushButtonState, getPushButtonState } from './push/buttonHelpers';
import {
  registerPushDevice,
  deregisterPushDevice,
} from './push/registerDevice';
import {
  getServiceWorkerRegistration,
  getPushManagerSubscription,
  getPushPermission,
  isPushManagerSupported,
} from './utils/helpers';

setPushButtonState('hidden');

if (isPushManagerSupported()) {
  getServiceWorkerRegistration().then((registration) =>
    Promise.all([
      registration,
      getPushManagerSubscription(),
      getPushPermission(),
    ]).then(([registration, subscription, permission]) => {
      console.log({ registration, subscription, permission });
      setPushButtonState('idle');

      return;
      if (permission.state === 'denied') {
        setPushButtonState('blocked');
      } else if (permission.state === 'granted') {
        if (subscription) {
          // todo: maybe send subscription to verify
          setPushButtonState('granted');
        } else {
          setPushButtonState('idle');
        }
      } else if (registration) {
        setPushButtonState('idle');
      }
    })
  );
}

declare global {
  interface Window {
    pwpHandlePushDevice: () => void;
    pwpRegisterPushDevice: () => void;
    pwpDeregisterPushDevice: () => void;
  }
}

window.pwpHandlePushDevice = () =>
  getPushButtonState() === 'idle'
    ? registerPushDevice()
    : deregisterPushDevice();

window.pwpRegisterPushDevice = registerPushDevice;
window.pwpDeregisterPushDevice = deregisterPushDevice;
