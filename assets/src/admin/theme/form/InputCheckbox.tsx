import React from 'react';

import cn from '../../utils/classnames';
import FormElement, { Input } from './FormElement';

const InputCheckbox = ({
  form,
  name,
  label,
  rules = {},
}: {
  form: any;
  name: string;
  label: string;
  rules?: {};
}) => {
  const Input = ({ id, className, field, value }: Input) => (
    <input
      {...field}
      value="yes"
      id={id}
      className={cn(className)}
      type="checkbox"
      checked={value}
      onChange={(e) => field.onChange(e.target.checked)}
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

export default InputCheckbox;
