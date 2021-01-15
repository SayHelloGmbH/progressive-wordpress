import React from 'react';

import cn from '../../utils/classnames';

import './Image.css';
import { PWP_VARS } from '../../utils/constants';

const Image = ({
  id,
  size = 150,
  className = '',
}: {
  id: number;
  size?: number;
  className?: string;
}) => {
  const [src, setSrc] = React.useState<string>(null);

  React.useEffect(() => {
    fetch(`${PWP_VARS.restBase}wp/v2/media/${id}/`).then((resp) => {
      if (resp.status >= 300) {
        alert(`failed to load Image "${id}"`);
      } else {
        resp.json().then((data) => {
          setSrc(data.media_details.sizes.thumbnail.source_url);
        });
      }
    });
  }, [id]);

  return (
    <div
      className={cn(className, 'image')}
      style={{ width: size, height: size }}
    >
      {src && (
        <img className="image__img" src={src} height={size} width={size} />
      )}
    </div>
  );
};

export default Image;
