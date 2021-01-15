import { Settings, Translations } from './types';

declare global {
  interface Window {
    PwpJsVars: {
      ajaxUrl: string;
      homeUrl: string;
      generalError: string;
      settings: Settings;
      restBase: string;
      restPwpBase: string;
      translationStrings: Translations;
    };
  }
}

export const PWP_VARS = window.PwpJsVars;
