import { useState, useEffect } from 'react';

// ==============================|| LOCAL STORAGE ||============================== //

function safeParse<ValueType>(raw: string | null, fallback: ValueType): ValueType {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as ValueType;
  } catch {
    return fallback;
  }
}

export default function useLocalStorage<ValueType>(
  key: string,
  defaultValue: ValueType
): [ValueType, (newValue: ValueType | ((current: ValueType) => ValueType)) => void] {
  const [value, setValue] = useState<ValueType>(() => {
    const storedValue = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    return safeParse(storedValue, defaultValue);
  });

  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (typeof window !== 'undefined' && e.storageArea === localStorage && e.key === key) {
        setValue(e.newValue ? safeParse(e.newValue, defaultValue) : defaultValue);
      }
    };
    window.addEventListener('storage', listener);

    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [key, defaultValue]);

  const setValueInLocalStorage = (newValue: ValueType | ((current: ValueType) => ValueType)) => {
    setValue((currentValue) => {
      const result = typeof newValue === 'function' ? (newValue as (current: ValueType) => ValueType)(currentValue) : newValue;
      if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(result));
      return result;
    });
  };

  return [value, setValueInLocalStorage];
}
