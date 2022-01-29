import { Dispatch, useCallback, useEffect, useState } from 'react';
import { getStorageByType, deserialize, serialize } from './utils';

export type StorageType = 'session' | 'local';
export interface UseStorageOptions<T> {
  serializer?: (input: T) => string;
  deserializer?: (input: string) => T;
  type?: 'session' | 'local';
}

export default function useStorage<T>(
  key: string,
  initialValue: T,
  options?: UseStorageOptions<T>
): [T, Dispatch<T>] {
  const storedItem = getStorageByType(options?.type).getItem(key);
  const deserTry = deserialize<T>(storedItem, options);
  const [value, setValue] = useState<T>(
    storedItem && deserTry ? deserTry : initialValue
  );

  const setItem = (newValue: T) => {
    setValue(newValue);
    const seralizing = serialize(newValue, options);
    const localStore = getStorageByType(options?.type);
    localStore.setItem(key, seralizing);
  };

  useEffect(() => {
    const newValue = getStorageByType(options?.type).getItem(key);
    setValue(deserialize(newValue, options) || initialValue);
  }, []);

  const handleStorage = useCallback(
    (event: StorageEvent) => {
      if (event.key === key) {
        setValue(deserialize(event.newValue, options) || initialValue);
      }
    },
    [value]
  );

  useEffect(() => {
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [handleStorage]);

  return [value, setItem];
}
