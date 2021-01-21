import React from 'react';

import createStore, { Store } from 'unistore';
import { connect } from 'unistore/react';

import { VARS } from './constants';
import { Settings } from './types';
import { compareObjects, filterObject } from './objects';
import { useForm } from 'react-hook-form';

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

const settingsStoreActions = (store: Store<StoreState>) => ({
  setSettings: (state, newSetting: Settings) => ({
    settings: {
      ...state.settings,
      ...newSetting,
    },
  }),
  syncSettings: (state) =>
    new Promise((resolve, reject) =>
      postSettings(state.settings)
        .then((response) => {
          resolve(response);
          store.setState({ savedSettings: state.settings });
        })
        .catch((response) => {
          reject(response);
        })
    ),
});
