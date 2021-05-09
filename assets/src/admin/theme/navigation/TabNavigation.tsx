import React from 'react';

import cn from '../../utils/classnames';
import { Link, useLocation, useMenu } from '../../utils/router';

import styles from './TabNavigation.css';

const TabNavigation = ({ className = '' }: { className?: string }) => {
  const { page, hash: activeHash = null } = useLocation();
  const { menuItems } = useMenu();

  const activeSubmenu: Record<string, string> = React.useMemo(
    () =>
      !menuItems[page].submenu ||
      Object.entries(menuItems[page].submenu).length === 0
        ? {}
        : {
            ['']: menuItems[page].subtitle || menuItems[page].title,
            ...menuItems[page].submenu,
          },
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
      {activeSubmenu && (
        <div className={cn(styles.subnavigation)}>
          {Object.entries(activeSubmenu).map(([hash, title]) => (
            <Link
              className={cn(styles.sublink, {
                [styles.sublinkActive]:
                  activeHash === hash || (hash === '' && !activeHash),
              })}
              key={hash}
              page={page}
              subpage={hash}
            >
              {title}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default TabNavigation;
