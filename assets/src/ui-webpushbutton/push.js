import {urlBase64ToUint8Array} from './helpers';

(function(plugin, WebPushVars) {
  try {
    let active = false;
    const $body = document.getElementsByTagName('body')[0];

    const changePushStatus = (status) => {
      active = status;
      if (status) {
        $body.classList.add('pwp-notification--on');
      }
      else {
        $body.classList.remove('pwp-notification--on');
      }
    };

    const register = () => {
      $body.classList.add('pwp-notification--loader');
      console.log('WebPushVars.vapidPublcKey', WebPushVars.vapidPublcKey);
      navigator.serviceWorker.getRegistration().then((registration) => {
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
              WebPushVars.vapidPublcKey,
          ),
        }).then((subscription) =>
            addSubscription(subscription).then(() => changePushStatus(true)),
        ).catch(() => {
          changePushStatus(false);
          alert(plugin.message_pushadd_failed);
        }).finally(() => $body.classList.remove('pwp-notification--loader'));
      });
    };

    const deregister = () => {
      $body.classList.add('pwp-notification--loader');
      navigator.serviceWorker.getRegistration().then(function(registration) {
        registration.pushManager.getSubscription().
            then(function(subscription) {
              if (!subscription) {
                return;
              }
              subscription.unsubscribe().then(() =>
                  removeSubscription(subscription).then(() =>
                      changePushStatus(false),
                  ),
              ).catch(function() {
                changePushStatus(true);
                alert(plugin['message_pushremove_failed']);
              }).finally(() =>
                  $body.classList.remove('pwp-notification--loader'),
              );
            });
      });
    };

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

          fetch(`${plugin['AjaxURL']}?action=pwp_ajax_add_webpush_subscription`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  subscription,
                  clientdata,
                }),
              }).
              then((response) => response.json()).
              then((data) => resolve(data)).
              catch((e) => {
                reject(e);
              });
        });

    const removeSubscription = (subscription) =>
        new Promise((resolve, reject) => {
          fetch(
              `${plugin['AjaxURL']}?action=pwp_ajax_remove_webpush_subscription`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  endpoint: subscription.endpoint,
                }),
              },
          ).
              then((response) => response.json()).
              then((data) => resolve(data)).
              catch((e) => {
                reject(e);
              });
        });

    function handleSubscriptionID(subscription, handle) {
      /*
          const clientDatas = [];
          Object.keys(clientData).forEach(function(key) {
            Object.keys(clientData[key]).forEach(function(dataKey) {
              clientDatas.push(
                  `clientData[${key}][${dataKey}]=${clientData[key][dataKey]}`);
            });
          });*/

      console.log('POST', {
        subscription,
        clientData,
        handle,
      });

      fetch(
          `${plugin['AjaxURL']}?action=pwp_ajax_handle_webpush_subscription`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              subscription,
              clientData,
              handle,
            }),
          },
      ).then((response) => response.json()).then((data) => console.log(data));

      // todo: add subscription

      /*
        const action = 'pwp_ajax_handle_device_id';
        const request = new XMLHttpRequest();
        request.open('POST', plugin['AjaxURL'], true);
        request.setRequestHeader('Content-Type',
            'application/x-www-form-urlencoded; charset=UTF-8');
        request.onload = function() {
          $body.classList.remove('pwp-notification--loader');
        };
        request.send(
            `action=${action}&user_id=${subscription_id}&handle=${handle}&${clientDatas.join(
                '&')}`);

           */
    }

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        /**
         * Show toggler (hidden by default)
         */

        $body.classList.add('pwp-notification');

        /**
         * add trigger
         */

        const $toggler = document.getElementById('pwp-notification-button');
        if ($toggler) {
          $toggler.onclick = function() {
            if (active) {
              deregister();
            }
            else {
              register();
            }
          };
        }

        /**
         * check if is already registered
         */

        registration.pushManager.getSubscription().then((subscription) => {
          console.log('SUBSCRIPTION', subscription);
          if (subscription) {
            addSubscription(subscription);
            changePushStatus(true);
          }
        });
      });
    }

    window.pwpRegisterPushDevice = registerPushDevice;
    window.pwpDeregisterPushDevice = deregisterPushDevice;
  }
  catch (e) {}
})(PwpJsVars, WebPushVars);
