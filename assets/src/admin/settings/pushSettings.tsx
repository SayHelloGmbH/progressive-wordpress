import React from 'react';
import { PushProvider, VARS } from '../utils/constants';
import { IFirebasePushCredentials, IVapid } from '../utils/types';

const PushSettingsContext = React.createContext({
  pushProvider: VARS.pushProvider,
  vapidCredentials: VARS.vapid,
  setVapidCredentials: (credentials: IVapid) => {},
  firebasePushCredentials: VARS.firebasePushCredentials,
  setFirebasePushCredentials: (credentials: IFirebasePushCredentials) => {},
  pushCredentialsSet: false,
});

export const PushSettingsProvider = ({ children }: { children?: any }) => {
  const pushProvider = VARS.pushProvider;
  const [vapidCredentials, setVapidCredentials] = React.useState<IVapid>(
    VARS.vapid
  );
  const [
    firebasePushCredentials,
    setFirebasePushCredentials,
  ] = React.useState<IFirebasePushCredentials>(VARS.firebasePushCredentials);

  const pushCredentialsSet = React.useMemo<boolean>(
    () =>
      (pushProvider === 'firebase' &&
        firebasePushCredentials.serverKey !== '') ||
      (pushProvider === 'webpush' && vapidCredentials.publicKey !== ''),
    [vapidCredentials, firebasePushCredentials]
  );

  return (
    <PushSettingsContext.Provider
      value={{
        pushProvider,
        vapidCredentials,
        setVapidCredentials,
        firebasePushCredentials,
        setFirebasePushCredentials,
        pushCredentialsSet,
      }}
    >
      {children}
    </PushSettingsContext.Provider>
  );
};

export const useVapidCredentials = (): [
  IVapid,
  (credentials: IVapid) => void
] => {
  const { vapidCredentials, setVapidCredentials } = React.useContext(
    PushSettingsContext
  );
  return [vapidCredentials, setVapidCredentials];
};

export const useFirebasePushCredentials = (): [
  IFirebasePushCredentials,
  (credentials: IFirebasePushCredentials) => void
] => {
  const {
    firebasePushCredentials,
    setFirebasePushCredentials,
  } = React.useContext(PushSettingsContext);
  return [firebasePushCredentials, setFirebasePushCredentials];
};

export const usePushProvider = (): PushProvider => {
  const { pushProvider } = React.useContext(PushSettingsContext);
  return pushProvider;
};

export const usePushCredentialsSet = (): boolean => {
  const { pushCredentialsSet } = React.useContext(PushSettingsContext);
  return pushCredentialsSet;
};
