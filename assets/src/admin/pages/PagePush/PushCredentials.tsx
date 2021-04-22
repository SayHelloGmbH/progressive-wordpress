import React from 'react';
import { __ } from '@wordpress/i18n';

import { IFirebasePushCredentials, IVapid } from '../../utils/types';

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
import { VARS } from '../../utils/constants';

const PushCredentials = ({
  setPushCredentialsSet,
}: {
  setPushCredentialsSet: (pushCredentialsSet: boolean) => void;
}) => {
  const [vapidCredentials, setVapidCredentials] = React.useState<IVapid>(
    VARS.vapid
  );
  const [
    firebasePushCredentials,
    setFirebasePushCredentials,
  ] = React.useState<IFirebasePushCredentials>(VARS.firebasePushCredentials);

  /**
   * TODO:
   *  - find a solution to guess which method should be use
   *  - if firebasePushCredentials isset: create/show the firebase settings
   *  - else, show the vapid settings, but move them to a different component
   */

  return <p />;

  /*
  const [resetModal, setResetModal] = React.useState<boolean>(false);
  const vapidCredentials = VARS.vapid;

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
  );*/
};

export default PushCredentials;
