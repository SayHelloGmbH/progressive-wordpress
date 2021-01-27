import React from 'react';

import {
  Card,
  Form,
  FormTableGroup,
  FormControls,
  FormElement,
  FormFeedback,
  InputCheckbox,
  InputColor,
  InputRadio,
  InputSelect,
  InputText,
  InputTextarea,
  InputUpload,
  NOTICE_TYPES,
} from '../theme';
import { useSettingsForm } from '../settings';

const ManifestSettings = ({ settingsKeys }: { settingsKeys: string[] }) => {
  const { form, submit, error, loading } = useSettingsForm(settingsKeys);

  const { ['installable-mode']: mode } = form.watch(['installable-mode']);

  return (
    <Form onSubmit={submit}>
      <FormTableGroup card>
        <FormElement
          form={form}
          name="installable-mode"
          rules={{
            required: 'This value is required',
          }}
          Input={InputSelect}
        />
        {mode === 'trigger' && (
          <FormElement
            form={form}
            name="installable-onclick"
            rules={{
              required: 'This value is required',
            }}
            Input={InputText}
          />
        )}
      </FormTableGroup>
      <FormTableGroup>
        <FormElement
          form={form}
          name="manifest-theme-color"
          rules={{
            required: 'This value is required',
          }}
          Input={InputColor}
        />
        <FormElement
          form={form}
          name="manifest-background-color"
          rules={{
            required: 'This value is required',
          }}
          Input={InputColor}
        />
      </FormTableGroup>
      {error !== '' && (
        <FormFeedback type={NOTICE_TYPES.ERROR} message={error} />
      )}
      <FormControls type="submit" disabled={loading} />
    </Form>
  );
};

export default ManifestSettings;
