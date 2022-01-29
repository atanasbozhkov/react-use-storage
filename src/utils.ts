import { UseStorageOptions, StorageType } from './index';

// TODO: Docs. Do we need an exception handler?
export const getStorageByType = (storageType?: StorageType): Storage => {
  if (storageType === 'session') {
    return window.sessionStorage;
  } else {
    return window.localStorage;
  }
};

// Handle throws
export const serialize = <T>(
  value: T,
  options?: UseStorageOptions<T>
): string => {
  let result: string = '';
  if (options && options.serializer) {
    result = options.serializer(value);
  } else {
    result = JSON.stringify(value);
  }
  return result;
};

export const deserialize = <T>(
  value: string | null | undefined,
  options?: UseStorageOptions<T>
): T | undefined => {
  let result = undefined;
  if (value === null || value === undefined) {
    return result;
  }
  if (options && options.deserializer) {
    result = options.deserializer(value);
  } else {
    try {
      result = JSON.parse(value);
    } catch (e) {
      console.warn(
        `Could not deserialize JSON value. You might need to provide a serializer/deserializer option.`,
        e
      );
    }
  }
  return result;
};
