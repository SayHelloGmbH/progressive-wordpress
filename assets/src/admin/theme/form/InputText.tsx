import React from 'react';

import cn from '../../utils/classnames';
import FormElement, { Input } from './FormElement';

const InputText = ({
  form,
  name,
  label,
  rules = {},
  type = 'text',
}: {
  form: any;
  name: string;
  label: string;
  rules?: {};
  type?:
    | 'text'
    | 'color'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'hidden'
    | 'month'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'time'
    | 'url'
    | 'week';
}) => {
  const Input = ({ id, className, field, value }: Input) => (
    <input
      {...field}
      value={value}
      id={id}
      className={cn(className)}
      type={type}
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

export default InputText;
