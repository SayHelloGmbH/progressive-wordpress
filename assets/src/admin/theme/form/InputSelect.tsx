import React from 'react';

import { useController } from 'react-hook-form';

import { FormElement } from '../index';

const InputText = ({
  control,
  name,
  options,
  ...props
}: {
  control: any;
  name: string;
  options: Record<string, string>;
  [key: string]: any;
}) => {
  const { field, meta } = useController({ control, name, ...props });
  const Input = (
    <select {...field}>
      {Object.entries(options).map(([key, label]) => (
        <option value={key}>{label}</option>
      ))}
    </select>
  );

  return <FormElement input={Input} label={name} />;
};

export default InputText;
