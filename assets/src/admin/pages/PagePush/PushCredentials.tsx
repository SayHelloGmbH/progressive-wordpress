import React from 'react';
import { usePushProvider } from '../../settings/pushSettings';
import { PageContent } from '../../theme';
import PushCredentialsFirebase from './PushCredentialsFirebase';
import PushCredentialsWebPush from './PushCredentialsWebPush';

const PushCredentials = () => {
  const pushProvider = usePushProvider();
  return (
    <PageContent>
      {pushProvider === 'firebase' ? (
        <PushCredentialsFirebase />
      ) : (
        <PushCredentialsWebPush />
      )}
    </PageContent>
  );
};

export default PushCredentials;
