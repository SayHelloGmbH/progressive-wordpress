export type ISettingValue = string | boolean;

export interface ISetting {
  value: any;
  label: string;
  values: Record<string, ISettingValue>;
}

export type ISettings = Record<string, ISetting>;

export type IPluginStrings = Record<string, string>;

export interface IVapid {
  privateKey: string;
  publicKey: string;
  subject: string;
}

export type IMenuItems = Record<
  string,
  {
    title: string;
    visible: boolean;
  }
>;
