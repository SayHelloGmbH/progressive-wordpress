export const untrailingSlashIt = (str: string): string =>
  str.replace(/\/$/, '');

export const trailingSlashIt = (str: string): string =>
  untrailingSlashIt(str) + '/';

export const isFunction = (functionToCheck: any): boolean =>
  functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
