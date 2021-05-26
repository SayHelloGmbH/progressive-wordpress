import React from 'react';
import { useForm } from 'react-hook-form';
import { apiPost, pluginNamespace } from '../utils/apiFetch';
import { VARS } from '../utils/constants';
import {
  compareObjects,
  filterObject,
  keyValueFromSettings,
} from '../utils/objects';
import { ISettings } from '../utils/types';

const SettingsContext = React.createContext({
  settings: VARS.settings,
  savedSettings: VARS.settings,
  setSettings: (newSettingsValues: ISettings) => {},
  syncSettings: (keys: string[] = []) => new Promise((resolve, reject) => {}),
});

const postSettings = (data) => apiPost(pluginNamespace + 'settings', data);

export const SettingsProvider = ({ children }: { children?: any }) => {
  const [settings, setSettings] = React.useState<ISettings>(VARS.settings);
  const [savedSettings, setSavedSettings] = React.useState<ISettings>(
    VARS.settings
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        savedSettings,
        setSettings: (newSettingsValues: ISettings) => {
          const newSettings = {};
          Object.entries(newSettingsValues).map(([key, value]) => {
            newSettings[key] = {
              ...settings[key],
              value,
            };
          });
          setSettings({
            ...settings,
            ...newSettings,
          });
        },
        syncSettings: (keys: string[] = []) =>
          new Promise((resolve, reject) =>
            postSettings(keyValueFromSettings(filterObject(settings, keys)))
              .then((response: ISettings) => {
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
    settings,
    savedSettings,
    setSettings = () => {},
    syncSettings = () => Promise.resolve(),
  } = React.useContext(SettingsContext);

  const filteredSettings = React.useMemo<ISettings>(
    () => filterObject<ISettings>(settings, keys),
    [settings, keys]
  );

  const defaultValues = React.useMemo(
    () => keyValueFromSettings(filteredSettings),
    [filteredSettings]
  );

  const form = useForm({
    defaultValues,
  });

  const values: Record<string, any> = form.watch(Object.keys(defaultValues));
  React.useEffect(() => {
    !compareObjects(keyValueFromSettings(filteredSettings), values) &&
      setSettings(values);
  }, [values]);

  const submit = form.handleSubmit((data) => {
    setLoading(true);
    setError('');
    syncSettings(keys)
      .then((data) => {
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
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
  }, [settings, savedSettings]);

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

export const useSettings = (keys: string[] = []): ISettings => {
  const { savedSettings = {} } = React.useContext(SettingsContext);
  return filterObject<ISettings>(savedSettings, keys);
};

export const useTempSettings = (keys: string[] = []): ISettings => {
  const { settings = {} } = React.useContext(SettingsContext);
  return filterObject<ISettings>(settings, keys);
};
