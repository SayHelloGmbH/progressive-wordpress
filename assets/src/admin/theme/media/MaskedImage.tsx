import React from 'react';
import cn from '../../utils/classnames';
import styles from './MaskedImage.css';
import useWpImageUrl from './useWpImageUrl';

const MaskedImage = ({
  id,
  size = 150,
  className = '',
  color = '#000',
  raw = false,
}: {
  id: number;
  size?: number;
  className?: string;
  color?: string;
  raw?: boolean;
}) => {
  const src = useWpImageUrl(id);

  return (
    <div
      className={cn(className, styles.container, {
        [styles.raw]: raw,
      })}
      style={{ width: size, height: size }}
    >
      {src && (
        <div
          style={{
            width: size,
            height: size,
            backgroundColor: color,
            WebkitMaskImage: `url(${src})`,
            maskImage: `url(${src})`,
            maskSize: size,
            WebkitMaskSize: size,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        />
      )}
    </div>
  );
};

export default MaskedImage;
