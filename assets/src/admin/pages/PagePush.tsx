import React from 'react';
import { usePushCredentialsSet } from '../settings/pushSettings';
import PushCredentials from './PagePush/PushCredentials';
import PushSettings from './PagePush/PushSettings';

const PagePush = ({ settingsKeys }: { settingsKeys: string[] }) => {
  const pushCredentialsSet = usePushCredentialsSet();
  return (
    <React.Fragment>
      <PushCredentials />
      {pushCredentialsSet && <PushSettings settingsKeys={settingsKeys} />}
    </React.Fragment>
  );
};

export default PagePush;
