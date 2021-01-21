import { Settings, Translations } from './types';

declare global {
  interface Window {
    pwpJsVars: {
      ajaxUrl: string;
      homeUrl: string;
      generalError: string;
      settings: Settings;
      restBase: string;
      restPluginBase: string;
      translationStrings: Translations;
    };
  }
}

export const VARS = window.pwpJsVars;
