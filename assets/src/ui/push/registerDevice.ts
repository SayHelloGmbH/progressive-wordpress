import ClientJS from 'clientjs';

import { setPushButtonState } from './buttonHelpers';
import { apiDelete, apiPut, pluginNamespace } from '../utils/apiFetch';
import { urlBase64ToUint8Array } from '../utils/helpers';
import { VARS } from '../utils/constants';

const addSubscription = (subscription) =>
  new Promise((resolve, reject) => {
    const client = new ClientJS();
    const clientdata = {
      browser: {
        browser: client.getBrowser(),
        version: client.getBrowserVersion(),
        major: client.getBrowserMajorVersion(),
      },
      os: {
        os: client.getOS(),
        version: client.getOSVersion(),
      },
      device: {
        device: client.getDevice(),
        type: client.getDeviceType(),
        vendor: client.getDeviceVendor(),
      },
    };

    return apiPut(pluginNamespace + 'subscription', {
      subscription,
      clientdata,
    });
  });

const removeSubscription = (subscription) =>
  apiDelete(pluginNamespace + 'subscription', { subscription });

export const registerPushDevice = () => {
  setPushButtonState('loading');
  navigator.serviceWorker.getRegistration().then((registration) => {
    registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        ...(VARS.vapidPublcKey
          ? { applicationServerKey: urlBase64ToUint8Array(VARS.vapidPublcKey) }
          : {}),
      })
      .then((subscription) =>
        addSubscription(subscription).then(() => setPushButtonState('granted'))
      )
      .catch(() => {
        setPushButtonState('idle');
        alert('failed');
      });
  });
};

export const deregisterPushDevice = () => {
  setPushButtonState('loading');
  navigator.serviceWorker.getRegistration().then(function (registration) {
    registration.pushManager.getSubscription().then(function (subscription) {
      Boolean(subscription) &&
        subscription
          .unsubscribe()
          .then(() =>
            removeSubscription(subscription).then(() =>
              setPushButtonState('idle')
            )
          )
          .catch(function () {
            setPushButtonState('granted');
            alert('failed');
          });
    });
  });
};
