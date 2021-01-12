import React from 'react';

import cn from '../../utils/classnames';

import './Page.css';

const Page = ({
  title,
  className = '',
  children,
}: {
  title: string;
  className?: string;
  children?: any;
}) => (
  <div className={cn('pwp-page', 'wrap', 'metabox-holder', className)}>
    <h1 className="pwp-page__title">{title}</h1>
    <div className="pwp-page__content">{children}</div>
  </div>
);

export default Page;
