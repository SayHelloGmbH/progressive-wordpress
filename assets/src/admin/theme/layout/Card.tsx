import React from 'react';

import cn from '../../utils/classnames';

import styles from './Card.css';
import contentStyles from '../Content.css';

import { isCardClosed, setCardClosed } from '../../utils/localstorage';

const Card = ({
  className = '',
  canToggleKey = '',
  title = '',
  children,
}: {
  className?: string;
  canToggleKey?: string;
  title?: string;
  children?: any;
}) => {
  const [open, setOpen] = React.useState<boolean>(!isCardClosed(canToggleKey));

  const canToggle = React.useMemo(() => canToggleKey !== '', [canToggleKey]);

  React.useEffect(() => {
    canToggle && setCardClosed(canToggleKey, !open);
  }, [open]);

  return (
    <div
      className={cn(className, styles.card, {
        [styles.cardClosed]: !open && canToggle,
      })}
    >
      {title && (
        <div className={styles.heading}>
          <h2 className={styles.title}>{title}</h2>
          {canToggle && (
            <button
              className={styles.toggleButton}
              onClick={() => setOpen(!open)}
            >
              <span className="screen-reader-text">Toggle panel</span>
              <span
                className={cn('dashicons', styles.toggleButtonIcon, {
                  'dashicons-arrow-up-alt2': open,
                  'dashicons-arrow-down-alt2': !open,
                })}
              />
            </button>
          )}
        </div>
      )}
      <div className={cn(styles.content, contentStyles.content)}>
        {children}
      </div>
    </div>
  );
};

export default Card;
