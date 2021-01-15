import React from 'react';
import ReactDOM from 'react-dom';
import { useForm, Controller } from 'react-hook-form';

import { Link, Route, useLocation } from './utils/location';
import { useSettings, SettingsProvider } from './utils/settings';
import { __ } from './utils/i18n';
import {
  Card,
  Form,
  Page,
  TabNavigation,
  InputText,
  InputTextarea,
  InputSelect,
  InputCheckbox,
  InputRadio,
  InputUpload,
} from './theme';

const app = document.querySelector('#pwp-app');

const App = () => {
  const location = useLocation();
  const [settings, saveSettings] = useSettings();
  const form = useForm({
    defaultValues: {
      FirstName: 'nico@sayhello.ch',
      desc: '',
      'the-select': 'foo',
      agree: 'yes',
      theradio: 'foo',
      image: '5,8',
    },
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
        <Form onSubmit={form.handleSubmit((data) => console.log('DATA', data))}>
          <InputText
            form={form}
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
          <InputTextarea form={form} name="desc" label="Description" />
          <InputSelect
            form={form}
            name="the-select"
            label="Select Box"
            optionProps={(value) => ({ theValue: value })}
            options={{
              hallo: 'Welt',
              foo: 'Bar',
            }}
          />
          <InputCheckbox
            form={form}
            name="agree"
            label="Agree?"
            rules={{
              required: 'This value is required',
            }}
          />
          <InputRadio
            form={form}
            name="theradio"
            label="Select Box"
            optionProps={(value) => ({ theValue: value })}
            options={{
              hallo: 'Welt',
              foo: 'Foo',
              bar: 'Bar',
            }}
            rules={{
              required: 'This value is required',
            }}
          />
          <InputUpload form={form} name="image" label="Image" count={6} />
          <button type="submit">submit</button>
        </Form>
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
