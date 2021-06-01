declare global {
  interface Window {
    pwpUiJsVars: {
      ajaxUrl: string;
      homeUrl: string;
      generalError: string;
      restBase: string;
      restPluginBase: string;
      restPluginNamespace: string;
      vapidPublcKey: null | string;
      installpromptMode: 'normal' | 'trigger' | 'none';
      installpromptElement: null | string;
    };
  }
}

export const VARS = window.pwpUiJsVars;
