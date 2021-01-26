import { ISettings, IPluginStrings } from './types';

declare global {
  interface Window {
    pwpJsVars: {
      ajaxUrl: string;
      homeUrl: string;
      generalError: string;
      settings: ISettings;
      restBase: string;
      restPluginBase: string;
      pluginStrings: IPluginStrings;
    };
  }
}

export const VARS = window.pwpJsVars;
