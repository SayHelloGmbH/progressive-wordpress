import React from 'react';

import cn from './classnames';
import { VARS } from './constants';
import { IMenuItems } from './types';

const URL_BASE = `${VARS.adminUrl}admin.php?page=${VARS.pluginPrefix}-`;
const EVENT = 'pwp-history-change';
const historyChangeEvent = new Event(EVENT);

const getLocationFromUrl = (url: string): string => url.replace(URL_BASE, '');

const RouterContext = React.createContext<{
  location: string;
  setLocation: (location: string) => void;
  menuItems: IMenuItems;
  setMenuItems: (items: IMenuItems) => void;
}>({
  location: '',
  setLocation: () => {},
  menuItems: {},
  setMenuItems: () => {},
});

const subMenuItems: NodeList = document.querySelectorAll(
  '#toplevel_page_pwp-settings ul.wp-submenu a'
);

export const RouterProvider = ({ children }: { children?: any }) => {
  const [location, setLocation] = React.useState<string>(
    getLocationFromUrl(window.location.href)
  );
  const [menuItems, setMenuItems] = React.useState<IMenuItems>(VARS.menu);
  const activeMenuItemKeys = React.useMemo(
    () =>
      Object.entries(menuItems)
        .filter(([key, { visible }]) => visible)
        .map(([key]) => key),
    [menuItems]
  );

  React.useEffect(() => {
    const href = `admin.php?page=${VARS.pluginPrefix}-${location}`;
    Array.from(subMenuItems).map((item) => {
      const anchorElement = item as HTMLAnchorElement;
      const liElement = anchorElement.parentNode;
      const itemHref = anchorElement.getAttribute('href');
      if (itemHref === href) {
        (liElement as HTMLDListElement).classList.add('current');
      } else {
        (liElement as HTMLDListElement).classList.remove('current');
      }
    });
  }, [location]);

  React.useEffect(() => {
    Array.from(subMenuItems).map((item) => {
      const anchorElement = item as HTMLAnchorElement;
      const liElement = anchorElement.parentNode;
      const itemHref = anchorElement.getAttribute('href');
      const itemKey = getLocationFromUrl(VARS.adminUrl + itemHref);

      if (activeMenuItemKeys.indexOf(itemKey) === -1) {
        (liElement as HTMLDListElement).style.display = 'none';
      } else {
        (liElement as HTMLDListElement).style.display = 'block';
      }
    });
  }, [menuItems, activeMenuItemKeys]);

  const submenuClick = (e) => {
    e.preventDefault();
    history.pushState({}, null, (e.target as HTMLAnchorElement).href);
    window.dispatchEvent(historyChangeEvent);
  };

  React.useEffect(() => {
    Array.from(subMenuItems).map((item) =>
      item.addEventListener('click', submenuClick)
    );
    return () =>
      Array.from(subMenuItems).map((item) =>
        item.removeEventListener('click', submenuClick)
      );
  }, []);

  const updateLocation = () =>
    setLocation(window.location.href.replace(URL_BASE, ''));

  React.useEffect(() => {
    window.onkeydown = function (e) {
      if (e.keyCode == 8 && e.target == document.body) {
        e.preventDefault();
      }
    };
  }, []);

  React.useEffect(() => {
    updateLocation();
    window.addEventListener('popstate', () => updateLocation());
    window.addEventListener(EVENT, () => updateLocation());
    return () => {
      window.removeEventListener('popstate', () => updateLocation());
      window.removeEventListener(EVENT, () => updateLocation());
    };
  }, []);

  return (
    <RouterContext.Provider
      value={{ location, setLocation, menuItems, setMenuItems }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useLocation = () => {
  const { location } = React.useContext(RouterContext);
  return location;
};

export const useMenu = () => {
  const { menuItems, setMenuItems } = React.useContext(RouterContext);
  const showHideMenuItem = (menuKey: string, show: boolean): void => {
    if (Object.keys(menuItems).indexOf(menuKey) === -1) {
      return;
    }
    setMenuItems({
      ...menuItems,
      [menuKey]: {
        title: menuItems[menuKey].title,
        visible: show,
      },
    });
  };
  return {
    menuItems,
    showMenuItem: (menuKey: string): void => showHideMenuItem(menuKey, true),
    hideMenuItem: (menuKey: string): void => showHideMenuItem(menuKey, false),
  };
};

export const Link = ({
  to,
  children,
  isButton = false,
  className = '',
  ...props
}: {
  to: string;
  children?: any;
  isButton?: boolean;
  className?: string;
  [key: string]: any;
}) => (
  <a
    href={URL_BASE + to}
    className={cn(className, {
      button: isButton,
      'button-primary': isButton,
    })}
    {...props}
    onClick={(e) => {
      e.preventDefault();
      history.pushState({}, null, (e.target as HTMLAnchorElement).href);
      window.dispatchEvent(historyChangeEvent);
    }}
  >
    {children}
  </a>
);

export const Route = ({
  page = '',
  children,
}: {
  page?: string;
  children?: any;
}) => (useLocation() === page ? children : null);
