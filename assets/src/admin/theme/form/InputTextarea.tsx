import React from 'react';

import cn from '../../utils/classnames';
import FormElement, { Input } from './FormElement';

const InputTextarea = ({
  form,
  name,
  label,
  rules = {},
  rows = 4,
}: {
  form: any;
  name: string;
  label: string;
  rules?: {};
  rows?: number;
}) => {
  const Input = ({ id, className, field, value }: Input) => (
    <textarea
      {...field}
      value={value}
      id={id}
      className={cn(className)}
      rows={rows}
    />
  );

  return (
    <FormElement
      form={form}
      Input={Input}
      label={label}
      name={name}
      rules={rules}
    />
  );
};

export default InputTextarea;
