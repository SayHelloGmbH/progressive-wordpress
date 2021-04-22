import React from 'react';
import ReactDOM from 'react-dom';

import { __ } from '@wordpress/i18n';

import { Route, useLocation, RouterProvider, useMenu } from './utils/router';
import { SettingsProvider, useSettingsDiff } from './settings';
import { IVapid } from './utils/types';

import { Page, TabNavigation } from './theme';
import PageAbout from './pages/PageAbout';
import PageManifest from './pages/PageManifest';
import PageOffline from './pages/PageOffline';
import PagePush from './pages/PagePush';
import { pluginString } from './utils/pluginStrings';

import { VARS } from './utils/constants';

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
  const { showMenuItem, hideMenuItem } = useMenu();

  React.useEffect(() => {
    if (!pushCredentialsSet) {
      hideMenuItem('push-subscriptions');
    } else {
      showMenuItem('push-subscriptions');
    }
  }, [pushCredentialsSet]);

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
