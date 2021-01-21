import React from 'react';

import cn from '../../utils/classnames';

import styles from './Card.css';

const Card = ({
  className = '',
  canToggle = true,
  title,
  children,
}: {
  className?: string;
  canToggle?: boolean;
  title?: string;
  children?: any;
}) => {
  const [open, setOpen] = React.useState<boolean>(true);
  return (
    <div className={cn(className, styles.card, 'postbox', { closed: !open })}>
      {title && (
        <div className="postbox-header">
          <h2
            className="hndle"
            onClick={() => (canToggle ? setOpen(!open) : null)}
          >
            {title}
          </h2>
          {canToggle && (
            <button className="handlediv" onClick={() => setOpen(!open)}>
              <span className="screen-reader-text">Toggle panel</span>
              <span className="toggle-indicator" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
      {open && <div className="inside">{children}</div>}
    </div>
  );
};

export default Card;
