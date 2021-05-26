import React from 'react';
import cn from '../../utils/classnames';
import styles from './Image.css';
import useWpImageUrl from './useWpImageUrl';

const Image = ({
  id,
  size = 150,
  className = '',
  raw = false,
}: {
  id: number;
  size?: number;
  className?: string;
  raw?: boolean;
}) => {
  const src = useWpImageUrl(id);

  return (
    <div
      className={cn(className, styles.image, { [styles.raw]: raw })}
      style={{ width: size, height: size }}
    >
      {src && (
        <img className={styles.imageImg} src={src} height={size} width={size} />
      )}
    </div>
  );
};

export default Image;
