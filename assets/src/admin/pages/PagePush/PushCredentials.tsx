import React from 'react';
import { __ } from '@wordpress/i18n';

import { IVapid } from '../../utils/types';

import PushCredentialsSetUp from './PushCredentialsSetUp';
import {
  Button,
  ButtonGroup,
  Card,
  FormElement,
  InputText,
  PageContent,
} from '../../theme';
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
      <Card title={__('VAPID Credentials', 'progressive-wp')}>
        <FormElement
          name="vapid-public"
          Input={InputText}
          label={__('Public Key', 'progressive-wp')}
          value={credentials.publicKey}
          disabled
        />
        <FormElement
          name="vapid-private"
          Input={InputText}
          label={__('Private Key', 'progressive-wp')}
          value={credentials.privateKey}
          disabled
        />
        <FormElement
          name="vapid-subject"
          Input={InputText}
          label={__('Subject', 'progressive-wp')}
          value={credentials.subject}
          disabled
        />
        <ButtonGroup align="right">
          <Button onClick={() => setResetModal(true)}>
            {__('Reset credentials', 'progressive-wp')}
          </Button>
        </ButtonGroup>
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
