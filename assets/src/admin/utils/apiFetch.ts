import { VARS } from './constants';
import { trailingSlashIt } from './helpers';

export const apiGet = <T>(path: string): Promise<T> =>
  authFetch({ path, method: 'GET' });

export const apiPost = <T>(
  path: string,
  data: Record<string, any>
): Promise<T> => authFetch({ path, method: 'POST', body: data });

export const apiPut = <T>(
  path: string,
  data: Record<string, any>
): Promise<T> => authFetch({ path, method: 'PUT', body: data });

export const apiDelete = <T>(path: string): Promise<T> =>
  authFetch({ path, method: 'DELETE' });

export const pluginNamespace = trailingSlashIt(VARS.restPluginNamespace);

const authFetch = <T>({
  path,
  method,
  headers = {},
  body = {},
}: {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, any>;
  body?: Record<string, any>;
}): Promise<T> =>
  new Promise((resolve, reject) => {
    fetch(VARS.restBase + path, {
      method,
      ...(method === 'POST' || method === 'PUT'
        ? { body: JSON.stringify(body) }
        : {}),
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'X-WP-Nonce': VARS.nonce,
      },
    })
      .then((resp) => Promise.all([resp, resp.json()]))
      .then(([resp, data]) => {
        if (resp.status < 300) {
          resolve(data);
        } else {
          reject(data.message);
        }
      })
      .catch((e) => reject(VARS.generalError));
  });
