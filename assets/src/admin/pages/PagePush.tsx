import React from 'react';

import { IVapid } from '../utils/types';
import PushCredentials from './PagePush/PushCredentials';
import PushSettings from './PagePush/PushSettings';

const PagePush = ({
  settingsKeys,
  pushCredentials,
  setPushCredentials,
}: {
  settingsKeys: string[];
  pushCredentials: IVapid;
  setPushCredentials: (pushCredentials: IVapid) => void;
}) => (
  <React.Fragment>
    <PushCredentials
      credentials={pushCredentials}
      setCredentials={setPushCredentials}
    />
    {pushCredentials.privateKey !== '' && (
      <PushSettings settingsKeys={settingsKeys} />
    )}
  </React.Fragment>
);

export default PagePush;
