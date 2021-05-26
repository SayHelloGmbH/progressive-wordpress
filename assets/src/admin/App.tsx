import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import PageAbout from './pages/PageAbout';
import PageManifest from './pages/PageManifest';
import PageOffline from './pages/PageOffline';
import PagePush from './pages/PagePush';
import PagePushSubscriptions from './pages/PagePushSubscriptions';
import { SettingsProvider } from './settings';
import { Page, TabNavigation } from './theme';
import { VARS } from './utils/constants';
import { pluginString } from './utils/pluginStrings';
import { Route, RouterProvider } from './utils/router';

const app = document.querySelector('#pwp-app');
const shadowbox = document.querySelector('#pwp-shadowbox');
if (!shadowbox) {
  const elem = document.createElement('div');
  elem.id = 'pwp-shadowbox';
  document.body.appendChild(elem);
}

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
const pushSettingsKeys = [
  'push-badge',
  'notification-button',
  'notification-button-icon-color',
  'notification-button-bkg-color',
  'notification-button-bkg-color',
];

const App = () => {
  const [pushCredentialsSet, setPushCredentialsSet] = React.useState<boolean>(
    false
  );

  return (
    <Page title={pluginString('plugin.name')}>
      <TabNavigation />
      <Route page="settings">
        <PageAbout />
      </Route>
      <Route page="manifest">
        <PageManifest settingsKeys={manifestSettingsKeys} />
      </Route>
      <Route page="offline">
        <PageOffline settingsKeys={offlineSettingsKeys} />
      </Route>
      <Route page="push">
        <PagePush
          settingsKeys={pushSettingsKeys}
          pushCredentialsSet={pushCredentialsSet}
          setPushCredentialsSet={setPushCredentialsSet}
        />
      </Route>
      <Route page="push" hash="subscriptions">
        <PagePushSubscriptions />
      </Route>
    </Page>
  );
};

if (app) {
  ReactDOM.render(
    <SettingsProvider>
      <RouterProvider>
        <App />
      </RouterProvider>
    </SettingsProvider>,
    app
  );
}
