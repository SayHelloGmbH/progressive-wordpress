import React from 'react';
import styles from './PageContent.css';

const PageContent = ({
  children,
  ...props
}: {
  children: any;
  [key: string]: any;
}) => (
  <div className={styles.content} {...props}>
    {children}
  </div>
);

export default PageContent;
