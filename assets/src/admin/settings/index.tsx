import React from 'react';
import { useForm } from 'react-hook-form';

import { VARS } from '../utils/constants';
import { Settings } from '../utils/types';
import { compareObjects, filterObject } from '../utils/objects';

const SettingsContext = React.createContext();

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

export const SettingsProvider = ({ children }: { children?: any }) => {
  const [settings, setSettings] = React.useState<Settings>(VARS.settings);
  const [savedSettings, setSavedSettings] = React.useState<Settings>(
    VARS.settings
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        savedSettings,
        setSettings: (newSettings: Settings) =>
          setSettings({
            ...settings,
            ...newSettings,
          }),
        syncSettings: (keys: string[] = []) =>
          new Promise((resolve, reject) =>
            postSettings(filterObject(settings, keys))
              .then((response) => {
                resolve(response);
                setSavedSettings(response);
              })
              .catch((response) => {
                reject(response);
              })
          ),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsForm = (
  keys: string[] = []
): { form: any; submit: Function; error: string; loading: boolean } => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const {
    settings = {},
    saveSettings = {},
    setSettings = () => {},
    syncSettings = () => Promise.resolve(),
  } = React.useContext(SettingsContext);

  const filteredSettings = React.useMemo(() => filterObject(settings, keys), [
    settings,
    keys,
  ]);

  const form = useForm({
    defaultValues: filteredSettings,
  });

  const values = form.watch(Object.keys(filteredSettings));
  React.useEffect(() => {
    !compareObjects(filteredSettings, values) && setSettings(values);
  }, [values]);

  const submit = form.handleSubmit((data) => {
    setLoading(true);
    setError('');
    syncSettings(keys)
      .then((data) => {
        setLoading(false);
      })
      .catch((data) => {
        setError(data.message);
        setLoading(false);
      });
  });

  const keyEvent = async (e: KeyboardEvent) => {
    if ((e.ctrlKey === true || e.metaKey === true) && e.key === 's') {
      e.preventDefault();
      await submit();
      return;
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', keyEvent, false);
    return () => {
      window.removeEventListener('keydown', keyEvent);
    };
  }, [settings, saveSettings]);

  return { form, submit, error, loading };
};

export const useSettingsDiff = (keys: string[] = []): boolean => {
  const { settings = {}, savedSettings = {} } = React.useContext(
    SettingsContext
  );

  return !compareObjects(
    filterObject(settings, keys),
    filterObject(savedSettings, keys)
  );
};

export const useSettings = (keys: string[] = []): Settings => {
  const { savedSettings = {} } = React.useContext(SettingsContext);
  return filterObject(savedSettings, keys);
};
