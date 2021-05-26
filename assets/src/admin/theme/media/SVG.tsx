import React from 'react';
import cn from '../../utils/classnames';
import styles from './SVG.css';

const SVG = ({
  path,
  className = '',
  inline = false,
  ...props
}: {
  path: string;
  className?: string;
  inline?: boolean;
  [key: string]: any;
}) => {
  const [loadedIcon, setLoadedIcon] = React.useState('');

  React.useEffect(() => {
    const loadIcon = async () =>
      await import(
        /* webpackMode: "eager" */ `../../../../dist/static/admin/${path}`
      );

    loadIcon().then((loaded) => setLoadedIcon(loaded.default));
  }, [path]);

  return (
    <figure
      className={cn(className, styles.svg, {
        [styles.inline]: inline,
      })}
      dangerouslySetInnerHTML={{ __html: loadedIcon }}
      {...props}
    />
  );
};

export default SVG;
