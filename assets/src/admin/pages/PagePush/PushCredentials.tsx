import React from 'react';

import { IFirebasePushCredentials, IVapid } from '../../utils/types';

import { PageContent } from '../../theme';
import { PushProvider, VARS } from '../../utils/constants';

import PushCredentialsFirebase from './PushCredentialsFirebase';
import PushCredentialsWebPush from './PushCredentialsWebPush';

const PushCredentials = ({
  setPushCredentialsSet,
  pushCredentialsSet,
}: {
  setPushCredentialsSet: (pushCredentialsSet: boolean) => void;
  pushCredentialsSet: boolean;
}) => {
  const [pushProvider, setPushProvider] = React.useState<PushProvider>(
    VARS.pushProvider
  );
  const [vapidCredentials, setVapidCredentials] = React.useState<IVapid>(
    VARS.vapid
  );
  const [
    firebasePushCredentials,
    setFirebasePushCredentials,
  ] = React.useState<IFirebasePushCredentials>(VARS.firebasePushCredentials);

  React.useEffect(() => {
    if (
      (pushProvider === 'firebase' &&
        firebasePushCredentials.serverKey === '') ||
      (pushProvider === 'webpush' && vapidCredentials.publicKey === '')
    ) {
      setPushCredentialsSet(false);
    } else {
      setPushCredentialsSet(true);
    }
  }, [vapidCredentials, firebasePushCredentials]);

  return (
    <PageContent>
      {pushProvider === 'firebase' ? (
        <PushCredentialsFirebase
          credentials={firebasePushCredentials}
          setCredentials={setFirebasePushCredentials}
          credentialsSet={pushCredentialsSet}
        />
      ) : (
        <PushCredentialsWebPush
          credentials={vapidCredentials}
          setCredentials={setVapidCredentials}
          pushCredentialsSet={pushCredentialsSet}
        />
      )}
    </PageContent>
  );
};

export default PushCredentials;
