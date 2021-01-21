import createStore, { Store } from 'unistore';

import { Settings } from '../utils/types';
import { VARS } from '../utils/constants';
import { filterObject } from '../utils/objects';

interface StoreState {
  settings: Settings;
  savedSettings: Settings;
}

const initialState: {} = {
  settings: VARS.settings,
  savedSettings: VARS.settings,
};

const postSettings = (data) =>
  new Promise((resolve, reject) => {
    fetch(`${VARS.restPluginBase}settings`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((resp) => Promise.all([resp, resp.json()]))
      .then(([resp, data]) => {
        if (resp.status < 300) {
          resolve(data);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(() => {
        reject(new Error('<p>' + VARS.generalError + '</p>'));
      });
  });

export const settingsStoreActions = (store: Store<StoreState>) => ({
  setSettings: (state, newSetting: Settings) => ({
    settings: {
      ...state.settings,
      ...newSetting,
    },
  }),
  syncSettings: (state, keys: string[] = []) =>
    new Promise((resolve, reject) =>
      postSettings(filterObject(state.settings, keys))
        .then((response) => {
          resolve(response);
          store.setState({ savedSettings: response });
        })
        .catch((response) => {
          reject(response);
        })
    ),
});

export const settingsStore = createStore(initialState);
