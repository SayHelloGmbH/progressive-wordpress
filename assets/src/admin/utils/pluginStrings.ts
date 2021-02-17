import { VARS } from './constants';

const strings = VARS.pluginStrings;

export const pluginString = (
  key: string,
  values: Record<string, string | number> = {}
): string => {
  let string = key in strings ? strings[key] : key;
  Object.entries(values).map(([valueKey, value]) => {
    string = string.replace(new RegExp(`\{${valueKey}\}`, 'g'), String(value));
  });

  return string;
};
