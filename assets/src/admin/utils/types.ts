import DayJS from 'dayjs';
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

export interface IFirebasePushCredentials {
  serverKey: string;
  senderId: string;
}

export type IMenuItems = Record<
  string,
  {
    title: string;
    submenu: Record<string, string>;
  }
>;

interface Subscription {
  clientdata: ClientDataI;
  groups: Array<string>;
  id: string;
  subscription: null;
  time: DayJS.Dayjs | string;
  wp_user: string;
}

export interface SubscriptionApiI extends Subscription {
  time: string;
}

export interface SubscriptionI extends Subscription {
  time: DayJS.Dayjs;
}
