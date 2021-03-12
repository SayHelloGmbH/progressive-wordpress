import React from 'react';
import { __ } from '@wordpress/i18n';

import { apiPut, pluginNamespace } from '../utils/apiFetch';
import { IVapid } from '../utils/types';
import {
  Form,
  FormControls,
  FormElement,
  FormFeedback,
  FormTableGroup,
  InputText,
  NOTICE_TYPES,
} from '../theme';
import { useForm } from 'react-hook-form';

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
    defaultValues: { subject: '' },
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
      <FormTableGroup title={__('Set-up', 'progressive-wp')} card>
        <FormElement
          form={form}
          name="subject"
          label={__('VAPID Subject', 'progressive-wp')}
          rules={{
            required: 'This value is required',
          }}
          Input={InputText}
        />
      </FormTableGroup>
      {error !== '' && (
        <FormFeedback type={NOTICE_TYPES.ERROR} message={error} />
      )}
      <FormControls type="submit" disabled={loading} />
    </Form>
  );
};

export default PushCredentials;
