import { PWP_VARS } from './constants';

const strings = PWP_VARS.translationStrings;

export const __ = (
  key: string,
  values: Record<string, string | number> = {}
): string => {
  let string = key in strings ? strings[key] : key;
  Object.entries(values).map(([valueKey, value]) => {
    string = string.replace(new RegExp(`\{${valueKey}\}`, 'g'), value);
  });

  return string;
};
