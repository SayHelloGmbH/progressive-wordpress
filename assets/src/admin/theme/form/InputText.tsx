import React from 'react';

const InputText = ({
  name,
  value = '',
  className = '',
  type = 'text',
  ...props
}: {
  name: string;
  value?: string;
  className?: string;
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
}) => (
  <input
    name={name}
    className={className}
    id={name}
    value={value}
    type={type}
    {...props}
  />
);

export default InputText;
