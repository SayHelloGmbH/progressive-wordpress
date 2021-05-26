import React from 'react';
import cn from '../../utils/classnames';
import styles from './Notice.css';

export const NOTICE_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
};

const Notice = ({
  className = '',
  type = Object.values(NOTICE_TYPES)[0],
  message,
  children,
}: {
  className?: string;
  type?: string;
  message?: string;
  children?: any;
}) => (
  <div
    className={cn(className, styles[`notice-${type}`], styles.notice, {
      [styles.noticeInfo]: type === NOTICE_TYPES.INFO,
      [styles.noticeWarning]: type === NOTICE_TYPES.WARNING,
      [styles.noticeError]: type === NOTICE_TYPES.ERROR,
      [styles.noticeSuccess]: type === NOTICE_TYPES.SUCCESS,
    })}
    {...(message
      ? { dangerouslySetInnerHTML: { __html: message } }
      : { children })}
  />
);

export default Notice;
