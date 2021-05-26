import React from 'react';
import cn from '../../utils/classnames';
import styles from './Loader.css';

const Loader = ({
  block = false,
  size = 1.5,
  className = '',
}: {
  block?: boolean;
  size?: number;
  className?: string;
}) => (
  <div
    className={cn(className, styles.container, {
      [styles.containerBlock]: block,
    })}
    style={{ fontSize: size + 'rem' }}
  >
    <div className={styles.loader} />
  </div>
);

export default Loader;
