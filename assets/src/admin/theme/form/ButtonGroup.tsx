import React from 'react';
import cn from '../../utils/classnames';
import styles from './ButtonGroup.css';

const ButtonGroup = ({
  className = '',
  children,
  align = 'left',
}: {
  className?: string;
  children?: any;
  align?: 'left' | 'center' | 'right';
}) => (
  <div
    className={cn(
      className,
      styles.group,
      align === 'right'
        ? styles.alignRight
        : align === 'center'
        ? styles.alignCenter
        : styles.alignLeft
    )}
  >
    {children}
  </div>
);

export default ButtonGroup;
