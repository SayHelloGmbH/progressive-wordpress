import React from 'react';

import cn from '../../utils/classnames';
import { Link, useLocation } from '../../utils/router';

import styles from './TabNavigation.css';

const TabNavigation = ({
  className = '',
  links,
}: {
  className?: string;
  links: Record<string, string>;
}) => {
  const location = useLocation();
  return (
    <nav className={cn(className, styles.navigation)}>
      {Object.entries(links).map(([to, title]) => (
        <Link
          className={cn(styles.link, {
            [styles.linkActive]: location === to,
          })}
          key={to}
          to={to}
        >
          {title}
        </Link>
      ))}
    </nav>
  );
};

export default TabNavigation;
