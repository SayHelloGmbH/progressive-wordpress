import React from 'react';
import { useForm } from 'react-hook-form';
import { __ } from '@wordpress/i18n';
import {
  usePushCredentialsSet,
  useVapidCredentials,
} from '../../settings/pushSettings';
import {
  Button,
  ButtonGroup,
  Card,
  Form,
  FormControls,
  FormElement,
  FormFeedback,
  InputText,
  NOTICE_TYPES,
} from '../../theme';
import { apiDelete, apiPut, pluginNamespace } from '../../utils/apiFetch';
import { VARS } from '../../utils/constants';
import { IVapid } from '../../utils/types';
import CredentialsResetModal from './CredentialsResetModal';

const PushCredentialsWebPush = () => {
  const pushCredentialsSet = usePushCredentialsSet();
  const [credentials, setCredentials] = useVapidCredentials();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [resetModal, setResetModal] = React.useState<boolean>(false);
  const form = useForm({
    defaultValues: { subject: VARS.homeUrl },
  });

  if (!pushCredentialsSet) {
    return (
      <Form
        onSubmit={form.handleSubmit(({ subject }) => {
          setLoading(true);
          setError('');
          apiPut<IVapid>(pluginNamespace + 'vapid', { subject })
            .then((vapid) => setCredentials(vapid))
            .catch(() =>
              setError(
                __(
                  'VAPID credentials could not be generated',
                  'progressive-wordpress'
                )
              )
            )
            .finally(() => setLoading(false));
        })}
      >
        <Card title={__('Setup', 'progressive-wp')}>
          <p>
            <b>{__('VAPID Subject', 'progressive-wp')}</b>
          </p>
          <p>
            {__(
              'The subject needs to be a URL or a mailto: URL. This provides a point of contact in case the push service needs to contact the message sender.',
              'progressive-wp'
            )}
          </p>
          <FormElement
            form={form}
            name="subject"
            label={__('Subject', 'progressive-wp')}
            rules={{
              required: 'This value is required',
            }}
            Input={InputText}
          />
        </Card>
        {error !== '' && (
          <FormFeedback type={NOTICE_TYPES.ERROR} message={error} />
        )}
        <FormControls type="submit" disabled={loading} />
      </Form>
    );
  }

  return (
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
        <Button onClick={() => setResetModal(true)} buttonType="delete">
          {__('Reset credentials', 'progressive-wp')}
        </Button>
      </ButtonGroup>
      {resetModal && (
        <CredentialsResetModal
          title={__('Reset VAPID', 'progressive-wp')}
          description={__(
            'Are you sure you want to reset the VAPID credentials? This will invalidate and delete all current push subscriptions.',
            'progressive-wp'
          )}
          confirm={() =>
            new Promise((resolve, reject) =>
              apiDelete<IVapid>(pluginNamespace + 'vapid')
                .then((vapid) => {
                  setCredentials(vapid);
                  resolve(vapid);
                })
                .catch((error) => reject(error))
            )
          }
          closeModal={() => setResetModal(false)}
        />
      )}
    </Card>
  );
};

export default PushCredentialsWebPush;
