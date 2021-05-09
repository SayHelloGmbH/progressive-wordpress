import React from 'react';

import cn from '../../utils/classnames';
import { Link, useLocation, useMenu } from '../../utils/router';

import styles from './TabNavigation.css';

const TabNavigation = ({ className = '' }: { className?: string }) => {
  const { page, hash: activeHash } = useLocation();
  const { menuItems } = useMenu();

  const activeSubmenu: Record<string, string> = React.useMemo(
    () => menuItems[page].submenu || {},
    [menuItems, page]
  );

  return (
    <nav className={cn(className)}>
      <div className={cn(styles.navigation)}>
        {Object.entries(menuItems).map(([to, { title }]) => (
          <Link
            className={cn(styles.link, {
              [styles.linkActive]: page === to,
            })}
            key={to}
            page={to}
          >
            {title}
          </Link>
        ))}
      </div>
      <div className={cn(styles.subnavigation)}>
        {Object.entries(activeSubmenu).map(([hash, title]) => (
          <Link
            className={cn(styles.sublink, {
              [styles.linkActive]: activeHash === hash,
            })}
            key={hash}
            page={page}
            subpage={hash}
          >
            {title}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default TabNavigation;
