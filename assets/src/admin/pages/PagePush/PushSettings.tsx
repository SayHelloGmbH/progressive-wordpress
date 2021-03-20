import React from 'react';

import { __ } from '@wordpress/i18n';
import { useSettingsForm } from '../../settings';
import {
  Card,
  Form,
  FormControls,
  FormElement,
  FormFeedback,
  InputCheckbox,
  InputColor,
  InputSelect,
  InputUpload,
  NOTICE_TYPES,
  PageContent,
} from '../../theme';
import { IVapid } from '../../utils/types';
import { VARS } from '../../utils/constants';

const PushSettings = ({ settingsKeys }: { settingsKeys: string[] }) => {
  const { form, submit, error, loading } = useSettingsForm(settingsKeys);

  return (
    <Form onSubmit={submit}>
      <PageContent>
        <Card
          title={__('Push Notification settings', 'progressive-wp')}
          canToggleKey="push-notification-settings"
        >
          <FormElement
            form={form}
            name="push-badge"
            Input={InputUpload}
            title={__('Select Image', 'progressive-wp')}
            buttonText={__('Select', 'progressive-wp')}
          />
        </Card>
        <Card
          title={__('Push Button', 'progressive-wp')}
          canToggleKey="push-button"
        >
          <FormElement
            form={form}
            name="notification-button"
            Input={InputCheckbox}
          />
          <FormElement
            form={form}
            name="notification-button-icon-color"
            Input={InputColor}
          />
          <FormElement
            form={form}
            name="notification-button-bkg-color"
            Input={InputColor}
          />
        </Card>
        {error !== '' && (
          <FormFeedback type={NOTICE_TYPES.ERROR} message={error} />
        )}
        <FormControls type="submit" loading={loading} />
      </PageContent>
    </Form>
  );
};

export default PushSettings;
