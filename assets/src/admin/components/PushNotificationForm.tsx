import React from 'react';
import { __ } from '@wordpress/i18n';

import {
  Form,
  FormControls,
  FormElement,
  InputText,
  InputUpload,
} from '../theme';
import { useForm } from 'react-hook-form';
import { PushNotificationDataI } from '../utils/types';

const PushNotificationForm = ({
  defaultValues,
  onSubmit,
}: {
  defaultValues;
  onSubmit: (PushNotificationDataI) => void;
}) => {
  const form = useForm<PushNotificationDataI>({
    defaultValues,
  });

  return (
    <Form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
      <FormElement
        form={form}
        name="title"
        label={__('Title', 'progressive-wp')}
        stacked
        rules={{
          required: __('Title is required', 'progressive-wp'),
        }}
        Input={InputText}
      />
      <FormElement
        form={form}
        name="body"
        label={__('Body', 'progressive-wp')}
        stacked
        rules={{
          required: __('a Body is required', 'progressive-wp'),
        }}
        Input={InputText}
      />
      <FormElement
        form={form}
        name="url"
        label={__('URL', 'progressive-wp')}
        stacked
        rules={{
          required: __('an URL is required', 'progressive-wp'),
        }}
        Input={InputText}
      />
      <FormElement
        form={form}
        name="image"
        label={__('Image', 'progressive-wp')}
        stacked
        Input={InputUpload}
      />
      <FormControls
        type="submit"
        value={__('show preview', 'progressive-wp')}
      />
    </Form>
  );
};

export default PushNotificationForm;
