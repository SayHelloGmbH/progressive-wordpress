import React from 'react';
import cn from '../../utils/classnames';
import styles from './Tooltip.css';

const Tooltip = ({
  children,
  tip,
  className,
  nowrap = true,
}: {
  children: any;
  tip: string;
  className?: string;
  nowrap?: boolean;
}) => (
  <span
    className={cn(styles.trigger, className, { [styles.nowrap]: nowrap })}
    data-tip={tip}
  >
    {children}
  </span>
);

export default Tooltip;
