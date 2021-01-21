export const filterObject = (object: Object, keys: string[] = []) => {
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
  return (
    arr1.reduce((acc, value) => `${acc}${value}`, '') ===
    arr2.reduce((acc, value) => `${acc}${value}`, '')
  );
};
