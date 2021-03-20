import React from 'react';

import cn from '../../utils/classnames';
import { Link, useLocation, useMenu } from '../../utils/router';

import styles from './TabNavigation.css';

const TabNavigation = ({ className = '' }: { className?: string }) => {
  const location = useLocation();
  const { menuItems } = useMenu();
  return (
    <nav className={cn(className, styles.navigation)}>
      {Object.entries(menuItems).map(([to, { title, visible }]) =>
        visible ? (
          <Link
            className={cn(styles.link, {
              [styles.linkActive]: location === to,
            })}
            key={to}
            to={to}
          >
            {title}
          </Link>
        ) : null
      )}
    </nav>
  );
};

export default TabNavigation;
