import React from 'react';
import { __ } from '@wordpress/i18n';

import { Button, ShadowBox } from '../theme';

import PushNotificationForm from './PushNotificationForm';
import { PushNotificationDataI } from '../utils/types';
import PushNotificationPreview from './PushNotificationPreview';

const CreatePushNotification = ({ onClose }: { onClose: () => void }) => {
  const [data, setData] = React.useState<PushNotificationDataI>({
    title: 'title',
    body: 'body',
    url: 'https://google.com',
    image: '',
  });
  const [showPreview, setShowPreview] = React.useState<boolean>(false);

  return (
    <ShadowBox
      title={__('Create push notification', 'progressive-wp')}
      close={onClose}
      size="small"
    >
      {showPreview ? (
        <React.Fragment>
          <PushNotificationPreview data={data} />
          <Button onClick={() => setShowPreview(false)}>back</Button>
        </React.Fragment>
      ) : (
        <PushNotificationForm
          defaultValues={data}
          onSubmit={(data) => {
            setShowPreview(true);
            setData(data);
          }}
        />
      )}
    </ShadowBox>
  );
};

export default CreatePushNotification;
