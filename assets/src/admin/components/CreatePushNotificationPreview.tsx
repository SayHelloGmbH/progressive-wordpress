import React from 'react';
import { PushNotificationDataI } from '../utils/types';
import { Image } from '../theme';

const CreatePushNotificationPreview = ({
  className = '',
  data: { title = '', body = '', url = '', image = [] },
}: {
  className?: string;
  data: PushNotificationDataI;
}) => (
  <div className={className}>
    <p>
      <b>Preview:</b>
    </p>
    <p>
      {title} - {body} - {url}
    </p>
    {image.length !== 0 && image[0] !== 0 && (
      <p>
        <Image id={image[0]} />
      </p>
    )}
  </div>
);

export default CreatePushNotificationPreview;
