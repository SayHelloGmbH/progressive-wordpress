import React from 'react';

import cn from '../../utils/classnames';

import styles from './FormTableGroup.css';

const FormTableGroup = ({
  className = '',
  canToggle = true,
  children,
  card = false,
  title = '',
}: {
  className?: string;
  canToggle?: boolean;
  children?: any;
  card?: boolean;
  title?: string;
}) => {
  const [open, setOpen] = React.useState<boolean>(true);
  // todo: persist open state
  return (
    <tbody
      className={cn(className, {
        [styles.card]: card,
        [styles.cardClosed]: !open && canToggle,
      })}
    >
      {title !== '' && (
        <tr className={styles.cardTableRow}>
          <td colSpan={2} className={styles.heading}>
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
          </td>
        </tr>
      )}
      {children}
    </tbody>
  );
};

export default FormTableGroup;
