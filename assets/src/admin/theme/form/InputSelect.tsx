import React from 'react';

import cn from '../../utils/classnames';

const InputSelect = ({
  name,
  value = '',
  className = '',
  options = {},
  optionProps = () => ({}),
  emptyOption = false,
  ...props
}: {
  name: string;
  value?: string;
  className?: string;
  options: Record<string, string>;
  optionProps?: (value: string, label: string) => Record<string, any>;
  emptyOption?: boolean;
}) => (
  <select
    value={value}
    id={name}
    name={name}
    className={cn(className)}
    {...props}
  >
    {emptyOption && <option value="" {...optionProps('', '')} />}
    {Object.entries(options).map(([value, label]) => (
      <option value={value} key={value} {...optionProps(value, label)}>
        {label}
      </option>
    ))}
  </select>
);

export default InputSelect;
