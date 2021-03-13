import React from 'react';
import { __ } from '@wordpress/i18n';

import { IVapid } from '../utils/types';

import PushCredentialsSetUp from './PushCredentialsSetUp';
import { apiDelete, pluginNamespace } from '../utils/apiFetch';
import { Card, PageContent } from '../theme';

const PushCredentials = ({
  credentials,
  setCredentials,
}: {
  credentials: IVapid;
  setCredentials: (credentials: IVapid) => void;
}) => {
  if (credentials.privateKey === '' || credentials.publicKey === '') {
    return (
      <PushCredentialsSetUp
        credentials={credentials}
        setCredentials={setCredentials}
      />
    );
  }

  return (
    <PageContent>
      <Card title="test">
        CREDENTIALS{' '}
        <button
          onClick={() => {
            apiDelete<IVapid>(pluginNamespace + 'vapid')
              .then((vapid) => setCredentials(vapid))
              .catch(() => alert('failed'));
          }}
        >
          delete
        </button>
      </Card>
    </PageContent>
  );
};

export default PushCredentials;
