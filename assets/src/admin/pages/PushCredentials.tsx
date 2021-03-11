import React from 'react';
import { __ } from '@wordpress/i18n';

import { apiGet, pluginNamespace } from '../utils/apiFetch';
import { IVapid } from '../utils/types';

const PushCredentials = () => {
  React.useEffect(() => {
    apiGet<IVapid>(pluginNamespace + 'vapid').then((data) =>
      console.log('GET VAPID', data)
    );
  }, []);

  return <div>CREDENTIALS</div>;
};

export default PushCredentials;
