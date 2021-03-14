import React from 'react';
import { __ } from '@wordpress/i18n';

import { IVapid } from '../../utils/types';

import PushCredentialsSetUp from './PushCredentialsSetUp';
import { Card, PageContent } from '../../theme';
import VapidResetModal from './VapidResetModal';

const PushCredentials = ({
  credentials,
  setCredentials,
}: {
  credentials: IVapid;
  setCredentials: (credentials: IVapid) => void;
}) => {
  const [resetModal, setResetModal] = React.useState<boolean>(false);
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
        CREDENTIALS <button onClick={() => setResetModal(true)}>delete</button>
        {resetModal && (
          <VapidResetModal
            setCredentials={setCredentials}
            setResetModal={setResetModal}
          />
        )}
      </Card>
    </PageContent>
  );
};

export default PushCredentials;
