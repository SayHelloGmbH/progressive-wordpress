import React from 'react';
import cn from '../../utils/classnames';
import { Notice, NOTICE_TYPES } from '../index';
import styles from './FormFeedback.css';

const FormFeedback = ({
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
  <div className={cn(className, styles.wrapper)}>
    <Notice type={type} message={message}>
      {children}
    </Notice>
  </div>
);

export default FormFeedback;
