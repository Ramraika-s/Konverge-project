'use client';

/**
 * @fileOverview IndexedDB Cache Service
 * Provides a persistent storage layer with TTL support for app data.
 */

const DB_NAME = 'NexusHireCache';
const STORE_NAME = 'app_data';
const DB_VERSION = 1;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 Hours in milliseconds

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

export const CacheService = {
  /**
   * Opens the IndexedDB instance
   */
  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  /**
   * Saves data to the cache with a timestamp
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      const entry: CacheEntry<T> = {
        value,
        timestamp: Date.now(),
      };

      store.put(entry, key);
      return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (err) {
      console.warn('Cache write failed:', err);
    }
  },

  /**
   * Retrieves data from cache, ensuring it hasn't expired
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          const entry = request.result as CacheEntry<T> | undefined;
          if (!entry) return resolve(null);

          const isExpired = Date.now() - entry.timestamp > CACHE_TTL;
          if (isExpired) {
            this.remove(key); // Cleanup expired entry
            return resolve(null);
          }

          resolve(entry.value);
        };
        request.onerror = () => resolve(null);
      });
    } catch (err) {
      console.warn('Cache read failed:', err);
      return null;
    }
  },

  /**
   * Removes a specific key from cache
   */
  async remove(key: string): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(key);
  },

  /**
   * Clears all cached data
   */
  async clear(): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
  }
};
