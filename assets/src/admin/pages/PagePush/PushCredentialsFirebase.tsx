import React from 'react';
import { __ } from '@wordpress/i18n';

import { apiDelete, apiPut, pluginNamespace } from '../../utils/apiFetch';
import { IFirebasePushCredentials, IVapid } from '../../utils/types';
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
  PageContent,
} from '../../theme';
import { useForm } from 'react-hook-form';

import CredentialsResetModal from './CredentialsResetModal';

const PushCredentialsFirebase = ({
  credentials,
  setCredentials,
  credentialsSet,
}: {
  credentials: IFirebasePushCredentials;
  setCredentials: (credentials: IFirebasePushCredentials) => void;
  credentialsSet: boolean;
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [resetModal, setResetModal] = React.useState<boolean>(false);
  const form = useForm({
    defaultValues: credentials,
  });

  return (
    <Form
      onSubmit={form.handleSubmit(({ serverKey, senderId }) => {
        setLoading(true);
        setError('');
        apiPut<IFirebasePushCredentials>(
          pluginNamespace + 'firebase-credentials',
          {
            serverKey,
            senderId,
          }
        )
          .then((credentials) => setCredentials(credentials))
          .catch(() =>
            setError(
              __(
                'Firebase credentials could not be saved',
                'progressive-wordpress'
              )
            )
          )
          .finally(() => setLoading(false));
      })}
    >
      <Card title={__('Firebase credentials', 'progressive-wp')}>
        {!credentialsSet && (
          <React.Fragment>
            <p>
              {__(
                'This plugin uses Firebase Cloud Messaging as a messaging service.',
                'progressive-wp'
              )}
            </p>
            <ul>
              <li>
                {__('Go to Firebase Console', 'progressive-wp')}:{' '}
                <a href="https://console.firebase.google.com/" target="_blank">
                  https://console.firebase.google.com/
                </a>
              </li>
              <li>{__('Click "create new project"', 'progressive-wp')}</li>
              <li>
                {__(
                  'Follow the instructions to create your project',
                  'progressive-wp'
                )}
              </li>
              <li>
                {__('Now navigate to Project setting page', 'progressive-wp')}
              </li>
              <li>{__('Navigate to Cloud Messaging Tab', 'progressive-wp')}</li>
              <li>
                {__(
                  'There you will get two important key’s "Server Key" and "Sender Id"',
                  'progressive-wp'
                )}
              </li>
            </ul>
          </React.Fragment>
        )}
        <FormElement
          form={form}
          name="serverKey"
          label={__('Server Key', 'progressive-wp')}
          rules={{
            required: 'This value is required',
          }}
          Input={InputText}
          disabled={credentialsSet}
        />
        <FormElement
          form={form}
          name="senderId"
          label={__('Sender ID', 'progressive-wp')}
          rules={{
            required: 'This value is required',
          }}
          Input={InputText}
          disabled={credentialsSet}
        />
        {credentialsSet && (
          <ButtonGroup align="right">
            <Button onClick={() => setResetModal(true)} buttonType="delete">
              {__('remove credentials', 'progressive-wp')}
            </Button>
          </ButtonGroup>
        )}
        {resetModal && (
          <CredentialsResetModal
            title={__('Reset Firebase credentials', 'progressive-wp')}
            description={__(
              'Are you sure you want to reset the credentials? This will invalidate and delete all current push subscriptions.',
              'progressive-wp'
            )}
            confirm={() =>
              new Promise((resolve, reject) =>
                apiDelete<IFirebasePushCredentials>(
                  pluginNamespace + 'firebase-credentials'
                )
                  .then((credentials) => {
                    setCredentials(credentials);
                    form.setValue('serverKey', credentials.serverKey);
                    form.setValue('senderId', credentials.senderId);
                    resolve(credentials);
                  })
                  .catch((error) => reject(error))
              )
            }
            closeModal={() => setResetModal(false)}
          />
        )}
      </Card>
      {error !== '' && (
        <FormFeedback type={NOTICE_TYPES.ERROR} message={error} />
      )}
      {!credentialsSet && <FormControls type="submit" disabled={loading} />}
    </Form>
  );
};

export default PushCredentialsFirebase;
