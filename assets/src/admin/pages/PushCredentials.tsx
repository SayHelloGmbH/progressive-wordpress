import React from 'react';
import { __ } from '@wordpress/i18n';

import { IVapid } from '../utils/types';
import { VARS } from '../utils/constants';

import PushCredentialsSetUp from './PushCredentialsSetUp';

const PushCredentials = () => {
  const [credentials, setCredentials] = React.useState<IVapid>(VARS.vapid);

  if (credentials.privateKey === '' || credentials.publicKey === '') {
    return (
      <PushCredentialsSetUp
        credentials={credentials}
        setCredentials={setCredentials}
      />
    );
  }

  return <div>CREDENTIALS</div>;
};

export default PushCredentials;
