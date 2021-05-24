import React from 'react';
import { __ } from '@wordpress/i18n';

import { FormFeedback, ShadowBox, NOTICE_TYPES, Icon } from '../theme';

import { apiPost, pluginNamespace } from '../utils/apiFetch';
import { VARS } from '../utils/constants';
import { PushNotificationDataI } from '../utils/types';

import CreatePushNotificationForm from './CreatePushNotificationForm';
import CreatePushNotificationPreview from './CreatePushNotificationPreview';

import styles from './CreatePushNotification.css';
import { useForm } from 'react-hook-form';
const initialFormState = {
  title: 'title',
  body: 'body',
  url: VARS.homeUrl,
  image: '',
};

// todo: should be able to pass default data

const CreatePushNotification = ({
  onClose,
  receiver = null,
}: {
  onClose: () => void;
  receiver?: Array<string>;
}) => {
  const form = useForm<PushNotificationDataI>({
    defaultValues: initialFormState,
  });

  const formDataPreview = form.watch();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [sent, setSent] = React.useState<boolean>(false);

  const onSubmit = (data) => sendPush(data);

  const sendPush = (data: PushNotificationDataI) => {
    setLoading(true);
    setError('');
    console.log(data);
    apiPost(pluginNamespace + 'push-send', {
      ...data,
      image: parseInt(data.image) || 0,
      receiver,
    })
      .then(() => setSent(true))
      .catch((error) => setError(error.toString()))
      .finally(() => setLoading(false));
  };

  return (
    <ShadowBox
      title={__('Create push notification', 'progressive-wp')}
      close={onClose}
      size="medium"
    >
      <div className={styles.content}>
        {sent && (
          <div className={styles.sent}>
            <Icon icon="check-outline" className={styles.sentIcon} />
            <p className={styles.sentText}>
              {__('Push notification was sent successfully', 'progressive-wp')}
            </p>
          </div>
        )}
        <div className={styles.form}>
          <p>
            <b>
              {receiver === null
                ? __(
                    'Send push notification to all subscriptions',
                    'progressive-wp'
                  )
                : receiver.length === 1
                ? __(
                    'Send push notification to one subscription',
                    'progressive-wp'
                  )
                : __(
                    'Send push notification to multiple subscriptions',
                    'progressive-wp'
                  )}
            </b>
          </p>
          {error !== '' && (
            <FormFeedback type={NOTICE_TYPES.ERROR}>{error}</FormFeedback>
          )}
          <CreatePushNotificationForm
            form={form}
            onSubmit={onSubmit}
            loading={loading}
          />
        </div>
        <CreatePushNotificationPreview
          data={formDataPreview}
          className={styles.preview}
        />
      </div>
    </ShadowBox>
  );
};

export default CreatePushNotification;
