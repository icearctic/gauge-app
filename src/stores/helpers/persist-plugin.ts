import * as quasar from 'quasar';
import { PiniaPlugin, PiniaPluginContext } from 'pinia';
import * as capacitorPreferences from '@capacitor/preferences';

// forked from https://github.com/craigrileyuk/pinia-plugin-capacitor-persist/
type Store = PiniaPluginContext['store'];
type PartialState = Partial<Store['$state']>;
type RestoredFunction = (store: Store) => void;

export interface PersistOptions {
  include?: string[];
  exclude?: string[];
  onRestored?: RestoredFunction;
}

export interface PersistRules {
  include: string[];
  exclude: string[];
}

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: PersistOptions | boolean;
  }

  export interface PiniaCustomProperties {
    persistInitPromise?: Promise<void>
  }
}

interface IAsyncStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

let asyncStorage: IAsyncStorage = {
  get(key) {
    return Promise.resolve(localStorage.getItem(key));
  },
  set(key, value) {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  remove(key: string) {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
  clear() {
    localStorage.clear();
    return Promise.resolve();
  },
  keys() {
    return Promise.resolve(Object.keys(localStorage));
  }
}

if (quasar.Platform.is.nativeMobile) {
  // import statement needs to be static and not list named imports
  // to be stubbed for web build
  const { Preferences } = capacitorPreferences;

  asyncStorage = {
    async get(key) {
      const res = await Preferences.get({ key });
      return res?.value ?? null;
    },
    set(key, value) {
      return Preferences.set({ key, value });
    },
    remove(key: string) {
      return Preferences.remove({ key });
    },
    clear() {
      return Preferences.clear();
    },
    async keys() {
      const res = await Preferences.keys();
      return res?.keys ?? [];
    }
  }
}

const getItem = async (key: string) => {
  const value = await asyncStorage.get(key)
  return value == null ? null : JSON.parse(value);
};

const setItem = async (key: string, value: string | number | object): Promise<void> => {
  await asyncStorage.set(key, JSON.stringify(value));
};

export const clear = async (): Promise<void> => {
  return asyncStorage.clear();
};

export const removeItem = async (key: string): Promise<void> => {
  return asyncStorage.remove(key);
};

export const getKeys = async (): Promise<string[]> => {
  return asyncStorage.keys();
};

const updateStorage = async (store: Store, rules: PersistRules) => {
  const storeKey = store.$id;

  if (rules.include || rules.exclude) {
    const paths = rules.include
      ? rules.include
      : Object.keys(store.$state).filter((key) => rules.exclude.includes(key) === false);

    const partialState = paths.reduce((acc, curr) => {
      acc[curr] = store.$state[curr];
      return acc;
    }, {} as PartialState);
    await setItem(storeKey, partialState);
  } else {
    await setItem(storeKey, store.$state);
  }
};

const restoreState = (
  store: Store,
  storeKey: string,
  rules: PersistRules,
  onRestored?: RestoredFunction
): Promise<void> =>
  new Promise((resolve) => {
    getItem(storeKey).then((result) => {
      const subscribe = () => {
        store.$subscribe(() => {
          // finally callback for Chrome 60 compatibility
          updateStorage(store, rules).finally(() => {/**/});
        });
      };
      if (result) {
        store.$patch(result);
        updateStorage(store, rules).then(() => {
          subscribe();
          if (onRestored) onRestored(store);
          return resolve();
        });
      } else {
        subscribe();
        return resolve();
      }
    });
  });

export const piniaPersistPlugin: PiniaPlugin = ({ options, store }) => {
  if (!options.persist)
    return;
  const persistOptions: PersistOptions = typeof options.persist === 'boolean' ? {} : options.persist;

  const rules = {
    include: persistOptions.include,
    exclude: persistOptions.exclude,
  } as PersistRules;

  const storeKey = store.$id;
  store.persistInitPromise = restoreState(store, storeKey, rules, persistOptions.onRestored);
};
