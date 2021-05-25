import React from 'react';
import { __ } from '@wordpress/i18n';

import cn from '../utils/classnames';
import { PushNotificationDataI } from '../utils/types';
import { Icon, Image, MaskedImage, SVG } from '../theme';

import styles from './CreatePushNotificationPreview.css';
import { useSettings } from '../settings';
import { VARS } from '../utils/constants';

const CreatePushNotificationPreview = ({
  className = '',
  data: { title = '', body = '', url = '', image = '' },
}: {
  className?: string;
  data: PushNotificationDataI;
}) => {
  const {
    'push-badge': pushBadge,
    'manifest-name': manifestName,
  } = useSettings(['push-badge', 'manifest-name']);
  const imageId = React.useMemo<number>(
    () => image.split(',').map(parseInt)[0] || 0,
    [image]
  );

  return (
    <div className={cn(className)}>
      <div className={cn(styles.container)}>
        <SVG path="pixel-mock.svg" className={styles.mock} />
        <div
          className={cn(styles.deviceInner)}
          style={{
            backgroundImage: `url('${VARS.pluginUrl}assets/img/pixel-4-bkg.jpg')`,
          }}
        >
          <div className={styles.statusBar}>
            <span className={styles.time}>10:42</span>
            {pushBadge.value && (
              <span className={styles.icon}>
                <MaskedImage id={pushBadge.value} size={12} color="#fff" raw />
              </span>
            )}
            <span className={styles.battery}>100%</span>
          </div>
          <div className={styles.notification}>
            <header className={styles.notificationHeader}>
              <MaskedImage
                id={parseInt(VARS.faviconId)}
                size={12}
                raw
                className={styles.notificationHeaderImage}
              />
              <p className={styles.notificationHeaderName}>
                {manifestName.value}
              </p>
            </header>
            <div className={styles.notificationMain}>
              <div className={styles.notificationContent}>
                <p className={styles.notificationTitle}>{title}</p>
                <p className={styles.notificationBody}>{body}</p>
              </div>
              {imageId !== 0 ? (
                <Image
                  id={imageId}
                  className={styles.notificationImage}
                  size={36}
                  raw
                />
              ) : (
                <div
                  className={styles.notificationImagePlaceholder}
                  style={{ width: 36, height: 36 }}
                >
                  {manifestName.value.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <p className={styles.notificationUrl}>
            <Icon className={styles.notificationUrlIcon} icon="link" /> {url}
          </p>
        </div>
      </div>
      <p className={cn(styles.warning)}>
        {__(
          'This demo tries to give an hint how the push notification will look like. The length of the text and the line breaks may vary depending on the device.',
          'progressive-wp'
        )}
      </p>
    </div>
  );
};

export default CreatePushNotificationPreview;
