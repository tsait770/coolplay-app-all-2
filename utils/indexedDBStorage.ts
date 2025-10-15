import { Platform } from 'react-native';

const DB_NAME = 'CoolPlayDB';
const DB_VERSION = 1;
const STORE_NAME = 'storage';

let db: IDBDatabase | null = null;

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (Platform.OS !== 'web') {
      reject(new Error('IndexedDB is only available on web'));
      return;
    }

    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const indexedDBStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      const database = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => {
          resolve(request.result || null);
        };

        request.onerror = () => {
          reject(new Error('Failed to get item from IndexedDB'));
        };
      });
    } catch (error) {
      console.error('[IndexedDB] getItem error:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      const database = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(value, key);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error('Failed to set item in IndexedDB'));
        };
      });
    } catch (error) {
      console.error('[IndexedDB] setItem error:', error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      const database = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error('Failed to remove item from IndexedDB'));
        };
      });
    } catch (error) {
      console.error('[IndexedDB] removeItem error:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      const database = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(new Error('Failed to clear IndexedDB'));
        };
      });
    } catch (error) {
      console.error('[IndexedDB] clear error:', error);
    }
  },

  async getAllKeys(): Promise<string[]> {
    try {
      const database = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAllKeys();

        request.onsuccess = () => {
          resolve(request.result as string[]);
        };

        request.onerror = () => {
          reject(new Error('Failed to get all keys from IndexedDB'));
        };
      });
    } catch (error) {
      console.error('[IndexedDB] getAllKeys error:', error);
      return [];
    }
  },
};
