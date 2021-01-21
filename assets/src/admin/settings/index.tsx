import React from 'react';
import { useForm } from 'react-hook-form';

import { compareObjects, filterObject } from '../utils/objects';
import { settingsStore, settingsStoreActions } from './store';
import { Provider, useStoreState, useActions } from './unistore-hooks';
import { Settings } from '../utils/types';

export const SettingsProvider = ({ children }: { children?: any }) => (
  <Provider value={settingsStore}>{children}</Provider>
);

export const useSettingsForm = (
  keys: string[] = []
): { form: any; submit: Function; error: string; loading: boolean } => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const { settings } = useStoreState('settings');
  const { setSettings, syncSettings } = useActions(settingsStoreActions);

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
  }, []);

  return { form, submit, error, loading };
};

export const useSettingsDiff = (keys: string[] = []): boolean => {
  const { settings, savedSettings } = useStoreState([
    'settings',
    'savedSettings',
  ]);

  return !compareObjects(
    filterObject(settings, keys),
    filterObject(savedSettings, keys)
  );
};

export const useSettings = (keys: string[] = []): Settings => {
  const { savedSettings } = useStoreState(['savedSettings']);

  return filterObject(savedSettings, keys);
};
