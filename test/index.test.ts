import { renderHook, act } from '@testing-library/react-hooks';
import useStorage from '../src/index';

describe('useStorage', (): void => {
  const KEY = 'key';
  const VALUE = {
    INITIAL: 'initial value',
    CHANGED: 'changed value',
    MAP_CHANGED: new Map(Object.entries({ a: 'c' })),
    NONE: '',
  };

  describe('Setup', () => {
    it('Returns initial value', () => {
      const { result } = renderHook(() => useStorage(KEY, VALUE.INITIAL));
      expect(result.current[0]).toMatch(VALUE.INITIAL);
    });

    it('When no initial value is passed, returns an empty string', () => {
      const { result } = renderHook(() => useStorage(KEY, VALUE.NONE));
      expect(result.current[0]).toMatch(VALUE.NONE);
    });

    it('Returns setValue function', () => {
      const { result } = renderHook(() => useStorage(KEY, VALUE.INITIAL));
      expect(typeof result.current[1]).toMatch('function');
    });
  });

  it('When `setValue()` is called, the `value` updates', () => {
    const { result } = renderHook(() => useStorage(KEY, VALUE.INITIAL));

    act(() => {
      result.current[1](VALUE.CHANGED);
    });

    expect(result.current[0]).toMatch(VALUE.CHANGED);
  });

  it('When Session Storage ise selected - it is used', () => {
    const { result } = renderHook(() =>
      useStorage(KEY, VALUE.INITIAL, { type: 'session' })
    );

    act(() => {
      result.current[1](VALUE.CHANGED);
    });

    expect(sessionStorage.getItem(KEY)).toBe(JSON.stringify(VALUE.CHANGED));
  });

  it('When De/Serializers are passed in - they are used', () => {
    const { result } = renderHook(() =>
      useStorage<Map<string, string>>(
        KEY,
        new Map(Object.entries({ a: 'b' })),
        {
          serializer: (value) => {
            const serialized = JSON.stringify(Object.fromEntries(value));
            return serialized;
          },
          deserializer: (value) => {
            const deserializedResult = new Map<string, string>(
              Object.entries(JSON.parse(value))
            );
            return deserializedResult;
          },
        }
      )
    );

    act(() => {
      result.current[1](VALUE.MAP_CHANGED);
    });

    expect(localStorage.getItem(KEY)).toBe(JSON.stringify({ a: 'c' }));
  });

  it('When `value` changes, `localStorage` is updated', () => {
    const { result } = renderHook(() => useStorage(KEY, VALUE.INITIAL));

    act(() => {
      result.current[1](VALUE.CHANGED);
    });

    expect(localStorage.getItem(KEY)).toBe(JSON.stringify(VALUE.CHANGED));
  });
});
