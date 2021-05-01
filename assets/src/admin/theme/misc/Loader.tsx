import React from 'react';

import cn from '../../utils/classnames';

import styles from './Loader.css';

const Loader = ({
  block = false,
  size = 1.5,
}: {
  block?: boolean;
  size?: number;
}) => (
  <div
    className={cn(styles.container, {
      [styles.containerBlock]: block,
    })}
    style={{ fontSize: size + 'rem' }}
  >
    <div className={styles.loader} />
  </div>
);

export default Loader;
