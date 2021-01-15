import React from 'react';

import cn from '../../utils/classnames';
import FormElement, { Input } from './FormElement';

const InputSelect = ({
  form,
  name,
  label,
  rules = {},
  options = {},
  optionProps = () => ({}),
  emptyOption = false,
}: {
  form: any;
  name: string;
  label: string;
  rules?: {};
  options: Record<string, string>;
  optionProps?: (value: string, label: string) => Record<string, any>;
  emptyOption?: boolean;
}) => {
  const Input = ({ id, className, field, value }: Input) => (
    <select {...field} value={value} id={id} className={cn(className)}>
      {emptyOption && <option value="" {...optionProps('', '')} />}
      {Object.entries(options).map(([value, label]) => (
        <option value={value} {...optionProps(value, label)}>
          {label}
        </option>
      ))}
    </select>
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

export default InputSelect;
