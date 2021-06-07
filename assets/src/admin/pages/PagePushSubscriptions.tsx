import React from 'react';
import { __ } from '@wordpress/i18n';
import CreatePushNotification from '../components/CreatePushNotification';
import { usePushCredentialsSet } from '../settings/pushSettings';
import {
  Button,
  Card,
  FormFeedback,
  Loader,
  Notice,
  NOTICE_TYPES,
  PageContent,
} from '../theme';
import { apiGet, pluginNamespace } from '../utils/apiFetch';
import DayJS from '../utils/dayjs';
import { SubscriptionI, SubscriptionApiI } from '../utils/types';
import PushSubscription from './PagePush/PushSubscription';
import styles from './PagePushSubscriptions.css';

const PagePushSubscriptions = () => {
  const pushCredentialsSet = usePushCredentialsSet();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>('');
  const [subscriptions, setSubscriptions] = React.useState<
    Array<SubscriptionI>
  >([]);
  const [showSendAll, setShowSendAll] = React.useState<boolean>(false);

  const loadSubscriptions = () => {
    setLoading(true);
    setError('');
    apiGet<Record<string, SubscriptionApiI>>(
      pluginNamespace + 'push-subscriptions'
    )
      .then((resp) =>
        setSubscriptions(
          Object.values(resp).map((subscription) => ({
            ...subscription,
            time: DayJS(subscription.time),
          }))
        )
      )
      .catch(() =>
        setError(__('Subscriptions could not be loaded', 'progressive-wp'))
      )
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    loadSubscriptions();
  }, []);

  if (!pushCredentialsSet) {
    return (
      <PageContent>
        <Notice type={NOTICE_TYPES.ERROR}>
          {__('Please set the credentials first', 'progressive-wp')}
        </Notice>
      </PageContent>
    );
  }

  return (
    <PageContent>
      {error !== '' ? (
        <FormFeedback type={NOTICE_TYPES.ERROR}>{error}</FormFeedback>
      ) : (
        <Card title={__('Subscriptions', 'progressive-wp')}>
          {loading ? (
            <Loader block />
          ) : subscriptions.length === 0 ? (
            <p>{__('There are no subscriptions yet', 'progressive-wp')} </p>
          ) : (
            <div className={styles.list}>
              {subscriptions.map((subscription) => (
                <PushSubscription
                  subscription={subscription}
                  className={styles.element}
                />
              ))}
              {subscriptions.length >= 0 && (
                <React.Fragment>
                  {showSendAll && (
                    <CreatePushNotification
                      onClose={() => setShowSendAll(false)}
                    />
                  )}
                  <Button onClick={() => setShowSendAll(true)}>
                    {__('Send push notification to everyone', 'progressive-wp')}
                  </Button>
                </React.Fragment>
              )}
            </div>
          )}
        </Card>
      )}
    </PageContent>
  );
};

export default PagePushSubscriptions;
