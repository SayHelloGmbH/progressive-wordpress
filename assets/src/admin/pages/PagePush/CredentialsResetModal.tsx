import React from 'react';
import { __ } from '@wordpress/i18n';
import {
  Button,
  ButtonGroup,
  Notice,
  NOTICE_TYPES,
  ShadowBox,
} from '../../theme';

const CredentialsResetModal = ({
  title,
  description,
  confirm,
  closeModal,
}: {
  title: string;
  description: string;
  confirm: () => Promise<any>;
  closeModal: () => void;
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  return (
    <ShadowBox close={() => closeModal()} title={title} size="small">
      {(close) => (
        <React.Fragment>
          {error !== '' && <Notice type={NOTICE_TYPES.ERROR}>{error}</Notice>}
          <p>{description}</p>
          <ButtonGroup align="right">
            <Button
              disabled={loading}
              onClick={() => close().then(() => closeModal())}
            >
              {__('cancel', 'progressive-wp')}
            </Button>
            <Button
              loading={loading}
              onClick={() => {
                setLoading(true);
                confirm()
                  .then(() => close().then(() => closeModal()))
                  .catch((error) => setError(error.toString()))
                  .finally(() => setLoading(false));
              }}
              buttonType="primary"
            >
              {__('Reset anyway', 'progressive-wp')}
            </Button>
          </ButtonGroup>
        </React.Fragment>
      )}
    </ShadowBox>
  );
};

export default CredentialsResetModal;
