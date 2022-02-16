# @bozhkovatanas/react-use-storage

_depends on stable v16.8.1~_

Access [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and [Session Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) using [React hooks](https://reactjs.org/docs/hooks-intro.html).

With support for:

- Typescript
- Custom Serializers/Deserializers
- Local Storage and Session Storage

Project is a fork of [react-use-localstorage](https://github.com/dance2die/react-use-localstorage)

## How to use it

### Basic Hook Usage

```javascript
import useStorage from '@bozhkovatanas/react-use-storage';
const [item, setItem] = useStorage<string>('name', 'Initial Value');
```

### Full example

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import useStorage from '@bozhkovatanas/react-use-storage';

import './styles.css';

function App() {
  const [item, setItem] = useStorage<string>('name', 'Initial Value');

  return (
    <div className="App">
      <h1>Set Name to store in Local Storage</h1>
      <div>
        <label>
          Name:{' '}
          <input
            type="text"
            placeholder="Enter your name"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
```

### UseStorage Options

You can configure the storage type and pass custom (de)serializers to `useLocalStorage`.

```typescript
function useStorage<T>(
  key: string,
  initialValue: T,
  options?: UseStorageOptions<T>
): [T, Dispatch<T>];

export interface UseStorageOptions<T> {
  serializer?: (input: T) => string;
  deserializer?: (input: string) => T;
  type?: 'session' | 'local'; // Will default to 'local'
}
```

### Option Defaults

If no options are provided - `useStorage` will default to localStorage and `JSON.strinfigy` and `JSON.parse` will be used for serializing.

### Custom Serializers/Deserializers Example:

You can add support for storing values as long as you are able to serialize and deserialize them from strings.
Basic example for storing [Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) in local storage

```javascript
const mapSerializer = (value) => {
  const serializedMap = JSON.stringify(Object.fromEntries(value));
  return serializedMap;
},
const mapDeserializer = (value) => {
  const deserializedMap = new Map<string, string>(
  Object.entries(JSON.parse(value))
);
  return deserializedMap;
},

const [map, setMap] = useStorage<Map<string, string>>('KEY', new Map(), {
  serializer: mapSerializer,
  deserializer: mapDeserializer
}

```

### Note for SSR (server-side rendering)

If you are using Gatsby or other SSR frameworks, such as Next.js, refer to [this workaround](https://github.com/dance2die/react-use-localstorage/issues/24#issuecomment-581479939) by @hencatsmith.

You need to make sure that `window` is available.

```js
const useSsrLocalStorage = (
  key: string,
  initial: string
): [string, React.Dispatch<string>] => {
  return typeof window === 'undefined'
    ? [initial, (value: string) => undefined]
    : useStorage(key, initial);
};
```

## Demo

![demo](https://github.com/dance2die/react-use-localstorage/raw/master/react-use-localstorage.gif)
