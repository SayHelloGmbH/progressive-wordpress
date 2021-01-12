import React from 'react';

import { useController } from 'react-hook-form';

import { FormElement } from '../index';

const InputText = ({
  form,
  name,
  label,
  ...props
}: {
  form: any;
  name: string;
  label: string;
  [key: string]: any;
}) => {
  const { field, meta } = useController({
    control: form.control,
    name,
    ...props,
  });

  const error = React.useMemo(() =>
    name in form.errors ? form.errors[name] : null
  );
  //console.log('field', field);
  //console.log('meta', meta);
  console.log('error', error);
  const Input = <input {...field} type="text" />;

  return <FormElement input={Input} label={label} error={error} />;
};

export default InputText;
