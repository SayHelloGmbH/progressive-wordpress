import React from 'react';

import cn from '../../utils/classnames';
import { Link, useLocation } from '../../utils/location';

import './TabNavigation.css';

const TabNavigation = ({
  className = '',
  links,
}: {
  className?: string;
  links: Record<string, string>;
}) => {
  const location = useLocation();
  return (
    <nav className={cn(className, 'tab-navigation')}>
      {Object.entries(links).map(([to, title]) => (
        <Link
          className={cn('tab-navigation__link', {
            'tab-navigation__link--active': location === to,
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
