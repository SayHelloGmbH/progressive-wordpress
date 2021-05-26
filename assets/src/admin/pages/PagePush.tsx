import React from 'react';
import PushCredentials from './PagePush/PushCredentials';
import PushSettings from './PagePush/PushSettings';

const PagePush = ({
  settingsKeys,
  pushCredentialsSet,
  setPushCredentialsSet,
}: {
  settingsKeys: string[];
  pushCredentialsSet: boolean;
  setPushCredentialsSet: (pushCredentialsSet: boolean) => void;
}) => (
  <React.Fragment>
    <PushCredentials
      setPushCredentialsSet={setPushCredentialsSet}
      pushCredentialsSet={pushCredentialsSet}
    />
    {pushCredentialsSet && <PushSettings settingsKeys={settingsKeys} />}
  </React.Fragment>
);

export default PagePush;
