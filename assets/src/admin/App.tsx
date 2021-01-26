import React from 'react';
import ReactDOM from 'react-dom';
import { __ } from '@wordpress/i18n';

import { Route, useLocation } from './utils/router';
import { SettingsProvider, useSettingsDiff } from './settings';

import { Page, TabNavigation } from './theme';
import PageAbout from './pages/PageAbout';
import ManifestSettings from './pages/ManifestSettings';
import { pluginString } from './utils/pluginStrings';

const app = document.querySelector('#pwp-app');

const manifestSettingsKeys = [
  'installable-mode',
  'installable-onclick',
  'manifest-theme-color',
  'manifest-background-color',
];
const offlineSettingsKeys = [];
const pushSettingsKeys = [];

const App = () => {
  const location = useLocation();

  return (
    <Page title={pluginString('plugin.name') + `: ${location}`}>
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
