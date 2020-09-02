(
    function(plugin) {
      try {

        let active = false;
        const $body = document.getElementsByTagName('body')[0];

        function urlBase64ToUint8Array(base64String) {
          const padding = '='.repeat((
                                         4 - (
                                             base64String.length % 4
                                         )
                                     ) % 4);
          const base64 = (
              base64String + padding
          ).replace(/-/g, '+').replace(/_/g, '/');

          const rawData = atob(base64);
          const outputArray = new Uint8Array(rawData.length);

          for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
          }
          return outputArray;
        };

        console.log(urlBase64ToUint8Array(WebPushVars.vapidPublcKey));

        function changePushStatus(status) {
          active = status;
          if (status) {
            $body.classList.add('pwp-notification--on');
          } else {
            $body.classList.remove('pwp-notification--on');
          }
        }

        const registerPushDevice = function() {
          $body.classList.add('pwp-notification--loader');
          navigator.serviceWorker.ready.then(function(registration) {

            registration.pushManager.subscribe({
              userVisibleOnly: true,
            }).then(function(subscription) {
              const subscription_id = subscription.endpoint.split(
                  'fcm/send/')[1];
              handleSubscriptionID(subscription_id, 'add');
              changePushStatus(true);
            }).catch(function() {
              changePushStatus(false);
              alert(plugin['message_pushadd_failed']);
            });
          });
        };

        const deregisterPushDevice = function() {
          $body.classList.add('pwp-notification--loader');
          navigator.serviceWorker.ready.then(function(registration) {
            registration.pushManager.getSubscription().
                then(function(subscription) {
                  if (!subscription) {
                    return;
                  }
                  subscription.unsubscribe().then(function() {
                    const subscription_id = subscription.endpoint.split(
                        'fcm/send/')[1];
                    handleSubscriptionID(subscription_id, 'remove');
                    changePushStatus(false);
                  }).catch(function() {
                    changePushStatus(true);
                    alert(plugin['message_pushremove_failed']);
                  });
                });
          });
        };

        function handleSubscriptionID(subscription_id, handle) {

          const client = new ClientJS();
          const clientData = {
            'browser': {
              'browser': client.getBrowser(),
              'version': client.getBrowserVersion(),
              'major': client.getBrowserMajorVersion(),
            },
            'os': {
              'os': client.getOS(),
              'version': client.getOSVersion(),
            },
            'device': {
              'device': client.getDevice(),
              'type': client.getDeviceType(),
              'vendor': client.getDeviceVendor(),
            },
          };
          const clientDatas = [];
          Object.keys(clientData).forEach(function(key) {
            Object.keys(clientData[key]).forEach(function(dataKey) {
              clientDatas.push(
                  `clientData[${key}][${dataKey}]=${clientData[key][dataKey]}`);
            });
          });

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
        }

        if ('serviceWorker' in navigator && 'PushManager' in window) {

          navigator.serviceWorker.ready.then(function(registration) {

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
                  deregisterPushDevice();
                } else {
                  registerPushDevice();
                }
              };
            }

            /**
             * check if is already registered
             */

            registration.pushManager.getSubscription().
                then(function(subscription) {
                  if (subscription) {
                    changePushStatus(true);
                  }
                });
          });
        }

        window.pwpRegisterPushDevice = registerPushDevice;
        window.pwpDeregisterPushDevice = deregisterPushDevice;
      } catch (e) {

      }
    }
)(PwpJsVars);