import React from 'react';
import ReactDOM from 'react-dom';
import { useForm, Controller } from 'react-hook-form';

import { Link, Route, useLocation } from './utils/location';
import { useSettings, SettingsProvider } from './utils/settings';
import { __ } from './utils/i18n';
import { Card, Form, Page, TabNavigation, InputText } from './theme';

const app = document.querySelector('#pwp-app');

const App = () => {
  const location = useLocation();
  const [settings, saveSettings] = useSettings();
  const methods = useForm({
    defaultValues: {},
  });

  return (
    <Page title={__('plugin.name') + `: ${location}`}>
      <TabNavigation
        links={{
          '': 'Home',
          hello: 'Edit Menus',
          world: 'Manage Locations',
        }}
      />
      <Route page="">
        <Card title="Hallo Welt">
          <p>Home</p>
        </Card>
        <Card>
          <Form
            onSubmit={methods.handleSubmit((data) => console.log('DATA', data))}
          >
            <InputText
              form={methods}
              name="FirstName"
              label="First Name"
              rules={{
                required: 'This value is required',
                pattern: {
                  value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'This needs to be a valid Email adress',
                },
              }}
            />
            <button type="submit">submit</button>
          </Form>
        </Card>
      </Route>
      <br />
      <br />
      SETTINGS ERROR: {settings.error}
      <br />
      SETTINGS LOADING: {settings.loading ? 'true' : 'false'}
      <br />
      SETTINGS: {JSON.stringify(settings.data)}
      <br />
      <button
        disabled={settings.loading}
        onClick={() =>
          saveSettings({
            test: 'test',
          })
        }
      >
        set test
      </button>
      <br />
      <button
        disabled={settings.loading}
        onClick={() =>
          saveSettings({
            test: 'updated',
          })
        }
      >
        set updated
      </button>
      <br />
      <button
        disabled={settings.loading}
        onClick={() =>
          saveSettings({
            test: 'error',
          })
        }
      >
        set error
      </button>
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
