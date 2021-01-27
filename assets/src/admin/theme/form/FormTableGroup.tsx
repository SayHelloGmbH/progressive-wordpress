import React from 'react';

import cn from '../../utils/classnames';

import styles from './FormTableGroup.css';

const FormTableGroup = ({
  className = '',
  children,
  card = false,
}: {
  className?: string;
  children?: any;
  card?: boolean;
}) => (
  <tbody className={cn(className, { [styles.card]: card })}>{children}</tbody>
);

export default FormTableGroup;
