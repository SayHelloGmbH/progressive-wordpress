import React from 'react';
import ReactDOM from 'react-dom';

import { __ } from '@wordpress/i18n';

import { Route, useLocation } from './utils/router';
import { SettingsProvider, useSettingsDiff } from './settings';

import { Page, TabNavigation } from './theme';
import PageAbout from './pages/PageAbout';
import ManifestSettings from './pages/ManifestSettings';
import { pluginString } from './utils/pluginStrings';

import './App.css';

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
  'manifest-tracking-starturl-source',
  'manifest-tracking-starturl-medium',
  'manifest-tracking-starturl-campaign',
  'manifest-tracking-starturl-term',
  'manifest-tracking-starturl-content',
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
