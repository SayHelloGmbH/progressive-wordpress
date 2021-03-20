import React from 'react';
import { __ } from '@wordpress/i18n';

import {
  Button,
  ButtonGroup,
  Notice,
  NOTICE_TYPES,
  ShadowBox,
} from '../../theme';
import { apiDelete, pluginNamespace } from '../../utils/apiFetch';
import { IVapid } from '../../utils/types';
import { useMenu } from '../../utils/router';

const VapidResetModal = ({
  setCredentials,
  setResetModal,
}: {
  setCredentials: (vapid: IVapid) => void;
  setResetModal: (resetModal: boolean) => void;
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  return (
    <ShadowBox
      close={() => setResetModal(false)}
      title={__('Reset VAPID', 'progressive-wp')}
      size="small"
    >
      {(close) => (
        <React.Fragment>
          {error !== '' && <Notice type={NOTICE_TYPES.ERROR}>{error}</Notice>}
          <p>
            {__(
              'Are you sure you want to reset the VAPID credentials? This will invalidate and delete all current push subscriptions.',
              'progressive-wp'
            )}
          </p>
          <ButtonGroup align="right">
            <Button disabled={loading} onClick={close}>
              {__('cancel', 'progressive-wp')}
            </Button>
            <Button
              loading={loading}
              onClick={() => {
                setLoading(true);
                apiDelete<IVapid>(pluginNamespace + 'vapid')
                  .then((vapid) => close().then(() => setCredentials(vapid)))
                  .catch((error) => setError(error.toString()))
                  .finally(() => setLoading(false));
              }}
              primary
            >
              {__('Reset anyway', 'progressive-wp')}
            </Button>
          </ButtonGroup>
        </React.Fragment>
      )}
    </ShadowBox>
  );
};

export default VapidResetModal;
