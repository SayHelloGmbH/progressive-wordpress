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
  const {
    field: { value = '', ...field },
    meta,
  } = useController({
    control: form.control,
    name,
    ...props,
  });

  const error = React.useMemo(() =>
    name in form.errors ? form.errors[name] : null
  );

  const Input = <input {...field} value={value} type="text" />;

  return <FormElement input={Input} name={name} label={label} error={error} />;
};

export default InputText;
