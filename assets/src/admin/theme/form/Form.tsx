import React from 'react';

import styles from './Form.css';
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
  <form
    className={cn(className, styles.form)}
    onSubmit={(data) => onSubmit(data)}
  >
    {children}
  </form>
);

export default Form;
