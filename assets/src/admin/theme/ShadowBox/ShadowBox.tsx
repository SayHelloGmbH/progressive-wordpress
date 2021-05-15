import React from 'react';
import ReactDOM from 'react-dom';

import cn from '../../utils/classnames';
import { Card } from '../index';

import styles from './ShadowBox.css';
import { isFunction } from '../../utils/helpers';

const Portal = ({ children }: { children?: any }) =>
  ReactDOM.createPortal(children, document.querySelector('#pwp-shadowbox'));

export default ({
  title,
  children,
  close,
  size = 'large',
  className = '',
}: {
  title?: string;
  children?: any;
  close: Function;
  size?: 'large' | 'small';
  className?: string;
}) => {
  const [show, setShow] = React.useState<boolean>(false);

  React.useEffect(() => {
    setShow(true);
    return () => {
      setShow(false);
    };
  }, []);

  const onClose = () =>
    new Promise<void>((resolve) => {
      setShow(false);
      window.setTimeout(() => {
        close();
        resolve();
      }, 200);
    });

  return (
    <Portal>
      <div
        className={cn(className, styles.shadowbox, {
          [styles.shadowboxSmall]: size === 'small',
        })}
        data-visible={show}
      >
        <div className={styles.shadow} onClick={onClose} />
        <Card className={styles.box} title={title} toggleButtonClose={onClose}>
          {isFunction(children) ? children(onClose) : children}
        </Card>
      </div>
    </Portal>
  );
};
