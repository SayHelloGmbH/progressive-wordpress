import React from 'react';

import { useController } from 'react-hook-form';

import { FormElement } from '../index';

const InputText = ({
  control,
  name,
  ...props
}: {
  control: any;
  name: string;
  [key: string]: any;
}) => {
  const { field, meta } = useController({ control, name, ...props });
  const Input = <textaxrea {...field} />;

  return <FormElement input={Input} label={name} />;
};

export default InputText;
