import React from 'react';
import cn from '../../utils/classnames';

const InputCheckbox = ({
  name,
  value = '',
  className = '',
  onChange = () => ({}),
}: {
  name: string;
  value?: string;
  className?: string;
  onChange?: Function;
}) => (
  <input
    value="yes"
    id={name}
    name={name}
    className={cn(className)}
    type="checkbox"
    checked={Boolean(value)}
    onChange={(e) => onChange(e.target.checked)}
  />
);

export default InputCheckbox;
