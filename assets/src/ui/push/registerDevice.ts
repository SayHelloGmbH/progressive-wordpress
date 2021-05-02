import md5 from 'md5';

import { setPushButtonState } from './buttonHelpers';
import { apiDelete, apiPut, pluginNamespace } from '../utils/apiFetch';
import {
  getClientData,
  getPushManagerSubscription,
  getServiceWorkerRegistration,
  urlBase64ToUint8Array,
} from '../utils/helpers';
import { VARS } from '../utils/constants';

const getPushSubscriptionId = (subscription: PushSubscription): string =>
  md5(subscription.endpoint);

const addSubscription = (subscription: PushSubscription): Promise<any> =>
  apiPut(pluginNamespace + 'push-subscription', {
    subscriptionId: getPushSubscriptionId(subscription),
    subscription,
    clientdata: getClientData(),
  });

const removeSubscription = (subscription) =>
  apiDelete(
    pluginNamespace + `push-subscription/${getPushSubscriptionId(subscription)}`
  );

export const registerPushDevice = (): void => {
  setPushButtonState('loading');
  getServiceWorkerRegistration()
    .then((registration) =>
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          ...(VARS.vapidPublcKey
            ? {
                applicationServerKey: urlBase64ToUint8Array(VARS.vapidPublcKey),
              }
            : {}),
        })
        .then((subscription) =>
          addSubscription(subscription).then(() =>
            setPushButtonState('granted')
          )
        )
    )
    .catch((e) => {
      setPushButtonState('idle');
      console.log('ERROR', e);
      alert('Failed: ' + e.toString());
    });
};

export const deregisterPushDevice = (): void => {
  setPushButtonState('loading');
  getPushManagerSubscription()
    .then((subscription) => {
      if (Boolean(subscription)) {
        subscription
          .unsubscribe()
          .then(() =>
            removeSubscription(subscription).then(() =>
              setPushButtonState('idle')
            )
          )
          .catch((e) => {
            throw e;
          });
      } else {
        throw new Error(VARS.generalError);
      }
    })
    .catch((e) => {
      setPushButtonState('idle');
      console.log('ERROR', e);
      alert('Failed: ' + e.toString());
    });
};
