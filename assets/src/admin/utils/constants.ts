import {
  ISettings,
  IPluginStrings,
  IVapid,
  IFirebasePushCredentials,
  IMenuItems,
} from './types';

type cachingStrategy =
  | 'staleWhileRevalidate'
  | 'networkFirst'
  | 'cacheFirst'
  | 'networkOnly';

export type PushProvider = 'webpush' | 'firebase';

declare global {
  interface Window {
    pwpJsVars: {
      ajaxUrl: string;
      homeUrl: string;
      adminUrl: string;
      generalError: string;
      pluginUrl: string;
      pluginPrefix: string;
      settings: ISettings;
      restBase: string;
      restPluginBase: string;
      restPluginNamespace: string;
      pluginStrings: IPluginStrings;
      trackingParamKeys: Array<string>;
      cachingStrategyRoutes: Record<
        string,
        {
          name: string;
          regex: string;
          default: cachingStrategy;
        }
      >;
      cachingStrategies: Record<cachingStrategy, string>;
      nonce: string;
      vapid: IVapid;
      firebasePushCredentials: IFirebasePushCredentials;
      pushProvider: PushProvider;
      settingsParentKey: string;
      menu: IMenuItems;
      faviconId: string;
    };
  }
}

export const VARS = window.pwpJsVars;
