import React from 'react';
import { SubscriptionI } from '../../utils/types';

const PushSubscription = ({
  subscription: { time, wp_user, clientdata },
  className = '',
}: {
  subscription: SubscriptionI;
  className?: string;
}) => {
  return (
    <div className={className}>
      <p>
        {time.format('LLL')}
        {wp_user !== '' ? (
          <React.Fragment>
            {' - '}
            <b>{wp_user}</b>
          </React.Fragment>
        ) : (
          ''
        )}
      </p>
      <p>
        Browser: {clientdata.browser.browser} {clientdata.browser.version} - OS:{' '}
        {clientdata.os.os} {clientdata.os.version}
      </p>
    </div>
  );
};

export default PushSubscription;
