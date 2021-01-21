import React from 'react';
import ReactDOM from 'react-dom';

import { Route, useLocation } from './utils/router';
import { SettingsProvider, useSettingsDiff } from './settings';

import { __ } from './utils/i18n';
import { Page, TabNavigation } from './theme';
import PageAbout from './pages/PageAbout';
import PageSettings from './pages/PageSettings';
import PageSettingsPersonal from './pages/PageSettingsPersonal';

const app = document.querySelector('#pwp-app');

const settingsKeys = [
  'myString',
  'myStringArea',
  'mySelectValue',
  'myCheckox',
  'myRadio',
  'myImages',
];
const settingsPersonalKeys = ['myEmail'];

const App = () => {
  const location = useLocation();

  return (
    <Page title={__('plugin.name') + `: ${location}`}>
      <TabNavigation
        links={{
          '': 'About',
          settings: useSettingsDiff(settingsKeys) ? 'Settings*' : 'Settings',
          'settings-personal': useSettingsDiff(settingsPersonalKeys)
            ? 'Settings Personal*'
            : 'Settings Personal',
        }}
      />
      <Route page="">
        <PageAbout />
      </Route>
      <Route page="settings">
        <PageSettings settingsKeys={settingsKeys} />
      </Route>
      <Route page="settings-personal">
        <PageSettingsPersonal settingsKeys={settingsPersonalKeys} />
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
