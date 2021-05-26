import React from 'react';
import cn from '../../utils/classnames';
import { ISetting } from '../../utils/types';

const InputSelect = ({
  name,
  value = '',
  className = '',
  options,
  optionProps = () => ({}),
  emptyOption = false,
  setting,
  ...props
}: {
  name: string;
  value?: string;
  className?: string;
  options: Record<string, string>;
  optionProps?: (value: string, label: string) => Record<string, any>;
  emptyOption?: boolean;
  setting?: ISetting;
}) => {
  const settingsOptions = options || setting.values;
  return (
    <select
      value={value}
      id={name}
      name={name}
      className={cn(className)}
      {...props}
    >
      {emptyOption && <option value="" {...optionProps('', '')} />}
      {Object.entries(settingsOptions || {}).map(([value, label]) => (
        <option
          value={value}
          key={value}
          {...optionProps(value, String(label))}
        >
          {label}
        </option>
      ))}
    </select>
  );
};

export default InputSelect;
