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

const addSubscription = (subscription: PushSubscription): Promise<any> => {
  console.log('add subscription', subscription);
  return apiPut(pluginNamespace + 'push-subscription', {
    subscriptionId: getPushSubscriptionId(subscription),
    subscription,
    clientdata: getClientData(),
  });
};

const removeSubscription = (subscription) => {
  console.log('remove subscription', subscription);
  return apiDelete(
    pluginNamespace + `push-subscription/${getPushSubscriptionId(subscription)}`
  );
};
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
        .then((subscription) => addSubscription(subscription))
    )
    .catch((e) => {
      setPushButtonState('idle');
      console.log('ERROR: registerPushDevice pushManager.subscribe', e);
      alert('failed');
    });
};

export const deregisterPushDevice = () => {
  setPushButtonState('loading');
  console.log('deregisterPushDevice');
  getServiceWorkerRegistration().then((registration) => {
    console.log('unregister for registration', registration);
    getPushManagerSubscription()
      .then((subscription) => {
        console.log('subscription', Boolean(subscription));
        Boolean(subscription) &&
          subscription
            .unsubscribe()
            .then(() =>
              removeSubscription(subscription).then(() =>
                setPushButtonState('idle')
              )
            )
            .catch((e) => {
              console.log(
                'ERROR: registerPushDevice getServiceWorkerRegistration',
                e
              );
              setPushButtonState('granted');
              alert('failed');
            });
      })
      .catch((e) => {
        console.log('ERROR: getPushManagerSubscription', e);
      });
  });
};
