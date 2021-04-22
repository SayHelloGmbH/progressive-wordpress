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

declare global {
  interface Window {
    pwpJsVars: {
      ajaxUrl: string;
      homeUrl: string;
      adminUrl: string;
      generalError: string;
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
      settingsParentKey: string;
      menu: IMenuItems;
    };
  }
}

export const VARS = window.pwpJsVars;
