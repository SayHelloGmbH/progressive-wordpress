import React from 'react';
import { __ } from '@wordpress/i18n';

import { apiPut, pluginNamespace } from '../utils/apiFetch';
import { IVapid } from '../utils/types';
import {
  Card,
  Form,
  FormControls,
  FormElement,
  FormFeedback,
  InputText,
  NOTICE_TYPES,
  PageContent,
} from '../theme';
import { useForm } from 'react-hook-form';
import { VARS } from '../utils/constants';

const PushCredentials = ({
  credentials,
  setCredentials,
}: {
  credentials: IVapid;
  setCredentials: (credentials: IVapid) => void;
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const form = useForm({
    defaultValues: { subject: VARS.homeUrl },
  });

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
      <PageContent>
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
      </PageContent>
    </Form>
  );
};

export default PushCredentials;
