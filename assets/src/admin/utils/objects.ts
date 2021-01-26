import { ISettings, ISettingValue } from './types';

export const filterObject = <T>(object: T, keys: string[] = []) => {
  if (keys.length === 0) {
    return object;
  }

  const values = {};
  keys.map((key) => {
    if (key in object) {
      values[key] = object[key];
    }
  });
  return values;
};

export const compareObjects = (obj1, obj2): boolean => {
  const arr1 = Object.values(obj1);
  const arr2 = Object.values(obj2);
  if (arr1.length !== arr2.length) {
    return false;
  }
  return JSON.stringify(arr1) === JSON.stringify(arr2);
};

export const keyValueFromSettings = (
  settings: ISettings
): Record<string, ISettingValue> => {
  const newSettings = {};
  Object.entries(settings).map(([key, setting]) => {
    newSettings[key] = setting.value;
  });
  return newSettings;
};
