import React from 'react';

import cn from '../../utils/classnames';

const Button = ({
  className = '',
  children,
  ...props
}: {
  className?: string;
  children?: any;
  [key: string]: any;
}) => (
  <button className={cn(className, 'button', 'button-primary')} {...props}>
    {children}
  </button>
);

export default Button;
