import React from 'react';

import {
  Form,
  FormControls,
  FormElement,
  FormFeedback,
  InputCheckbox,
  InputRadio,
  InputSelect,
  InputText,
  InputTextarea,
  InputUpload,
  NOTICE_TYPES,
} from '../theme';
import { useSettingsForm } from '../settings';

const PageSettings = ({ settingsKeys }: { settingsKeys: string[] }) => {
  const { form, submit, error, loading } = useSettingsForm(settingsKeys);

  return (
    <Form onSubmit={submit}>
      <FormElement
        form={form}
        name="myString"
        label="My String"
        rules={{
          required: 'This value is required',
        }}
        Input={InputText}
      />
      <FormElement
        form={form}
        name="myStringArea"
        label="Description"
        Input={InputTextarea}
      />
      <FormElement
        form={form}
        name="mySelectValue"
        label="Color"
        Input={InputSelect}
        optionProps={(color) => ({ style: { color } })}
        options={{
          green: 'Green',
          red: 'Red',
          blue: 'Blue',
        }}
      />
      <FormElement
        form={form}
        name="myCheckox"
        label="Check this"
        Input={InputCheckbox}
      />
      <FormElement
        form={form}
        name="myRadio"
        label="Radio Box"
        rules={{
          required: 'This value is required',
        }}
        Input={InputRadio}
        options={{
          hallo: 'Welt',
          foo: 'Foo',
          bar: 'Bar',
        }}
      />
      <FormElement
        form={form}
        name="myImages"
        label="Image (max. 2)"
        Input={InputUpload}
        count={4}
      />
      {error !== '' && (
        <FormFeedback type={NOTICE_TYPES.ERROR} message={error} />
      )}
      <FormControls type="submit" disabled={loading} />
    </Form>
  );
};

export default PageSettings;
