import React from 'react';
import { UseFormMethods } from 'react-hook-form';
import { __ } from '@wordpress/i18n';
import {
  Form,
  FormControls,
  FormElement,
  InputText,
  InputUpload,
} from '../theme';
import { PushNotificationDataI } from '../utils/types';

const CreatePushNotificationForm = ({
  form,
  onSubmit,
  loading,
}: {
  form: UseFormMethods<PushNotificationDataI>;
  onSubmit: (data: PushNotificationDataI) => void;
  loading: boolean;
}) => (
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
    <FormControls type="submit" disabled={loading} />
  </Form>
);

export default CreatePushNotificationForm;
