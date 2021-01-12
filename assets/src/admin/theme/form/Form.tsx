import React from 'react';

import cn from '../../utils/classnames';

const Form = ({
  className = '',
  children,
  onSubmit,
}: {
  className?: string;
  children?: any;
  onSubmit: Function;
}) => (
  <form className={cn('pwp-form', className)} onSubmit={onSubmit}>
    {children}
  </form>
);

export default Form;
