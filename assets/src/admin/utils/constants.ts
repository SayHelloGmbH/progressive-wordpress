import { Settings, Translations } from './types';

declare global {
  interface Window {
    PwpJsVars: {
      ajaxUrl: string;
      homeUrl: string;
      generalError: string;
      settings: Settings;
      restBase: string;
      translationStrings: Translations;
    };
  }
}

export const PWP_VARS = window.PwpJsVars;
