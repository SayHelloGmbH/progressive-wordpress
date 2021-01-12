import React from 'react';

export const useLocation = () => {
  const [location, setLocation] = React.useState<string>('');

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
  ...props
}: {
  to: string;
  children?: any;
  [key: string]: any;
}) => (
  <a href={`#${to}`} {...props}>
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
