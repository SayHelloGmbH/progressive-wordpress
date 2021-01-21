import React from 'react';

const InputTextarea = ({
  name,
  value = '',
  className = '',
  rows = 4,
  ...props
}: {
  name: string;
  value?: string;
  className?: string;
  rows?: number;
}) => (
  <textarea
    name={name}
    className={className}
    id={name}
    value={value}
    rows={rows}
    {...props}
  />
);

export default InputTextarea;
