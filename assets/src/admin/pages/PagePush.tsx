import React from 'react';

import { IVapid } from '../utils/types';
import { VARS } from '../utils/constants';
import PushCredentials from './PagePush/PushCredentials';
import PushSettings from './PagePush/PushSettings';

const PagePush = ({ settingsKeys }: { settingsKeys: string[] }) => {
  const [pushCredentials, setPushCredentials] = React.useState<IVapid>(
    VARS.vapid
  );

  return (
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
};

export default PagePush;
