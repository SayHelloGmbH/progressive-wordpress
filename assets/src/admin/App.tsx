import React from 'react';
import ReactDOM from 'react-dom';
import { Link, useLocation } from './src/location';
import { useSettings, SettingsProvider } from './src/settings';

const app = document.querySelector('#pwp-app');

const App = () => {
  const location = useLocation();
  const [settings, saveSettings] = useSettings();

  return (
    <div>
      LOCATION: {location}
      <br />
      <Link to="hallo">Hallo</Link> - <Link to="welt">Welt</Link>
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
    </div>
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
