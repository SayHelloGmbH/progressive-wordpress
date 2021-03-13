import React from 'react';
import ReactDOM from 'react-dom';

import { __ } from '@wordpress/i18n';

import { Route, useLocation } from './utils/router';
import { SettingsProvider, useSettingsDiff } from './settings';

import { Page, TabNavigation } from './theme';
import PageAbout from './pages/PageAbout';
import ManifestSettings from './pages/ManifestSettings';
import OfflineUsageSettings from './pages/OfflineUsageSettings';
import PushSettings from './pages/PushSettings';
import { pluginString } from './utils/pluginStrings';

import './App.css';
import { VARS } from './utils/constants';
import PushCredentials from './pages/PushCredentials';
import { IVapid } from './utils/types';

const app = document.querySelector('#pwp-app');

const manifestSettingsKeys = [
  'installable-mode',
  'installable-onclick',
  'manifest-name',
  'manifest-short-name',
  'manifest-starturl',
  'manifest-description',
  'manifest-display',
  'manifest-orientation',
  'manifest-theme-color',
  'manifest-background-color',
  ...(VARS.trackingParamKeys
    ? VARS.trackingParamKeys.map((key) => `manifest-tracking-starturl-${key}`)
    : []),
];
const offlineSettingsKeys = [
  'offline-page',
  'offline-content',
  ...Object.keys(VARS.cachingStrategyRoutes).map(
    (key) => `offline-strategy-${key}`
  ),
  'offline-indicator',
  'offline-indicator-text',
  'offline-indicator-position',
  'offline-indicator-color-text',
  'offline-indicator-color-background',
];
const pushSettingsKeys = [];

const App = () => {
  const [pushCredentials, setPushCredentials] = React.useState<IVapid>(
    VARS.vapid
  );
  const location = useLocation();

  return (
    <Page title={pluginString('plugin.name')}>
      <TabNavigation
        links={{
          '': __('About', 'progressive-wp'),
          manifest:
            __('Add to Homescreen', 'progressive-wp') +
            (useSettingsDiff(manifestSettingsKeys) ? '*' : ''),
          offline:
            __('Offline usage', 'progressive-wp') +
            (useSettingsDiff(offlineSettingsKeys) ? '*' : ''),
          push:
            __('Push Notifications', 'progressive-wp') +
            (useSettingsDiff(pushSettingsKeys) ? '*' : ''),
        }}
      />
      <Route page="">
        <PageAbout />
      </Route>
      <Route page="manifest">
        <ManifestSettings settingsKeys={manifestSettingsKeys} />
      </Route>
      <Route page="offline">
        <OfflineUsageSettings settingsKeys={offlineSettingsKeys} />
      </Route>
      <Route page="push">
        <PushCredentials
          credentials={pushCredentials}
          setCredentials={setPushCredentials}
        />
        {pushCredentials.privateKey !== '' && (
          <PushSettings settingsKeys={pushSettingsKeys} />
        )}
      </Route>
    </Page>
  );
};

if (app) {
  ReactDOM.render(
    <SettingsProvider>
      <App />
    </SettingsProvider>,
    app
  );
}
