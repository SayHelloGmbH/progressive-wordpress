import React from 'react';
import { PushNotificationDataI } from '../utils/types';
import { Image } from '../theme';

const CreatePushNotificationPreview = ({
  className = '',
  data: { title = '', body = '', url = '', image = '' },
}: {
  className?: string;
  data: PushNotificationDataI;
}) => {
  const imageId = React.useMemo<number>(
    () => image.split(',').map(parseInt)[0] || 0,
    [image]
  );
  return (
    <div className={className}>
      <p>
        <b>Preview:</b>
      </p>
      <p>
        {title} - {body} - {url}
      </p>
      {imageId !== 0 && (
        <p>
          <Image id={imageId} />
        </p>
      )}
    </div>
  );
};

export default CreatePushNotificationPreview;
