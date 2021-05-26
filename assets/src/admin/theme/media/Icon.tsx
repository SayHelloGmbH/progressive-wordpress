import React from 'react';
import cn from '../../utils/classnames';
import styles from './Icon.css';
import SVG from './SVG';

const Icon = ({
  icon,
  className = '',
  border = false,
  round = false,
  spinning = false,
  ...props
}: {
  icon: string;
  className?: string;
  border?: boolean;
  round?: boolean;
  spinning?: boolean;
  [key: string]: any;
}) => (
  <SVG
    className={cn(className, styles.icon, {
      [styles.animationSpin]: spinning,
      [styles.border]: border,
      [styles.round]: round,
    })}
    path={`icons/${icon}.svg`}
    {...props}
  />
);

export default Icon;
