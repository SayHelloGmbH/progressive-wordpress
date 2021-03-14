import React from 'react';

import cn from '../../utils/classnames';

import styles from './Button.css';

const Button = ({
  className = '',
  children,
  disabled = false,
  loading = false,
  primary = false,
  ...props
}: {
  className?: string;
  children?: any;
  disabled?: boolean;
  loading?: boolean;
  primary?: boolean;
  [key: string]: any;
}) => (
  <button
    className={cn(className, styles.button, {
      [styles.buttonPrimary]: primary,
    })}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? 'loading..' : children}
  </button>
);

export default Button;
