import React from 'react';
import { __ } from '@wordpress/i18n';

import { SubscriptionI, SubscriptionApiI } from '../utils/types';
import { apiGet, pluginNamespace } from '../utils/apiFetch';
import {
  Card,
  FormFeedback,
  Loader,
  NOTICE_TYPES,
  PageContent,
} from '../theme';
import DayJS from '../utils/dayjs';
import PushSubscription from './PagePush/PushSubscription';

import styles from './PagePushSubscriptions.css';

const PagePushSubscriptions = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>('');
  const [subscriptions, setSubscriptions] = React.useState<
    Array<SubscriptionI>
  >([]);

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
            </div>
          )}
        </Card>
      )}
    </PageContent>
  );
};

export default PagePushSubscriptions;
