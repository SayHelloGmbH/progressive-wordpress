import React from 'react';
import { PushNotificationDataI } from '../utils/types';

const PushNotificationPreview = ({
  data: { title = '', body = '', url = '', image = null },
}: {
  data: PushNotificationDataI;
}) => <p>{title}</p>;

export default PushNotificationPreview;
