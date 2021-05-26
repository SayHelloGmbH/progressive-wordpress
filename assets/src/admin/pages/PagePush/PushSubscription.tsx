import React from 'react';
import { __ } from '@wordpress/i18n';
import CreatePushNotification from '../../components/CreatePushNotification';
import { Button, Icon, Tooltip } from '../../theme';
import cn from '../../utils/classnames';
import { SubscriptionI } from '../../utils/types';
import styles from './PushSubscription.css';

const PushSubscription = ({
  subscription: { time, wp_user, clientdata, id },
  className = '',
}: {
  subscription: SubscriptionI;
  className?: string;
}) => {
  const [showCreateModal, setShowCreateModal] = React.useState<boolean>(false);
  const browser = React.useMemo(
    () =>
      clientdata.browser.browser === 'Firefox' ? (
        <Icon icon="firefox" />
      ) : clientdata.browser.browser === 'Chrome' ? (
        <Icon icon="chrome" />
      ) : clientdata.browser.browser === 'Edge' ? (
        <Icon icon="chrome" />
      ) : clientdata.browser.browser === 'Safari' ? (
        <Icon icon="safari" />
      ) : (
        clientdata.browser.browser
      ),
    [clientdata.browser.browser]
  );

  const os = React.useMemo(
    () =>
      clientdata.os.os === 'Windows' ? (
        <Icon icon="windows" />
      ) : clientdata.os.os === 'macOS' ? (
        <Icon icon="apple" />
      ) : clientdata.os.os === 'Linux' ? (
        <Icon icon="linux" />
      ) : clientdata.os.os === 'Android' ? (
        <Icon icon="android" />
      ) : clientdata.os.os === 'iOS' ? (
        <Icon icon="ios" />
      ) : (
        clientdata.os.os
      ),
    [clientdata.os.os]
  );

  return (
    <div className={cn(className, styles.row)}>
      <div className={cn(styles.user)}>
        <p>{time.format(__('MMMM D, YYYY h:mm A', 'progressive-wp'))}</p>
        {wp_user !== '' && (
          <p>
            <b>{wp_user}</b>
          </p>
        )}
      </div>
      <div className={cn(styles.device)}>
        <p>
          {clientdata?.platform?.type && (
            <Tooltip
              tip={
                clientdata?.platform?.type === 'desktop'
                  ? __('Desktop', 'progressive-wp')
                  : __('Mobile', 'progressive-wp')
              }
            >
              <Icon
                icon={
                  clientdata?.platform?.type === 'desktop' ? 'desktop' : 'phone'
                }
              />
            </Tooltip>
          )}{' '}
          <Tooltip
            tip={clientdata.browser.browser + ' ' + clientdata.browser.version}
          >
            {browser}
          </Tooltip>{' '}
          <Tooltip tip={clientdata.os.os + ' ' + clientdata.os.version}>
            {os}
          </Tooltip>
        </p>
      </div>
      {/*<div className={cn(styles.notifications)}>
        <p>Notifications gesendet: 0</p>
        <p>Notifications geöffnet: 0</p>
        <p>Notification erstellen</p>
      </div>*/}
      <div className={cn(styles.controls)}>
        <Tooltip tip={__('Create push notification', 'progressive-wp')}>
          <Button onClick={() => setShowCreateModal(true)}>
            <Icon icon="send" />
          </Button>
        </Tooltip>
        {showCreateModal && (
          <CreatePushNotification
            onClose={() => setShowCreateModal(false)}
            receiver={[id]}
          />
        )}
      </div>
    </div>
  );
};

export default PushSubscription;
