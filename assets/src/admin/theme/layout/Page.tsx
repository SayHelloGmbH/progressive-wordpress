import React from 'react';
import cn from '../../utils/classnames';
import styles from './Page.css';

const Page = ({
  title,
  className = '',
  children,
}: {
  title: string;
  className?: string;
  children?: any;
}) => (
  <div className={cn(styles.page, 'wrap', 'metabox-holder', className)}>
    <h1 className={styles.title}>{title}</h1>
    <div className={styles.content}>{children}</div>
  </div>
);

export default Page;
