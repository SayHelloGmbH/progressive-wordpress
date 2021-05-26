import React from 'react';
import cn from '../../utils/classnames';
import styles from './Form.css';

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
