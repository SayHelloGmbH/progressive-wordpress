import './App';
import { apiGet, pluginNamespace } from './utils/apiFetch';

apiGet(pluginNamespace + 'vapid').then((data) =>
  console.log('GET VAPID', data)
);
