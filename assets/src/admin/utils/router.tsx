import React from 'react';

import cn from './classnames';

export const useLocation = () => {
  const [location, setLocation] = React.useState<string>('');

  React.useEffect(() => {
    window.onkeydown = function (e) {
      if (e.keyCode == 8 && e.target == document.body) {
        e.preventDefault();
      }
    };
  }, []);

  React.useEffect(() => {
    setLocation(window.location.hash.replace('#', ''));
    window.addEventListener(
      'hashchange',
      () => setLocation(window.location.hash.replace('#', '')),
      false
    );
  }, []);

  return location;
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
    href={`#${to}`}
    className={cn(className, {
      button: isButton,
      'button-primary': isButton,
    })}
    {...props}
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
