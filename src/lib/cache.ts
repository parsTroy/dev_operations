// Simple in-memory cache for development
// In production, consider Redis or similar
const cache = new Map<string, { data: any; expiry: number }>();

export const cacheUtils = {
  set: (key: string, data: any, ttlSeconds: number = 300) => {
    cache.set(key, {
      data,
      expiry: Date.now() + (ttlSeconds * 1000),
    });
  },

  get: (key: string) => {
    const item = cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      cache.delete(key);
      return null;
    }
    
    return item.data;
  },

  delete: (key: string) => {
    cache.delete(key);
  },

  clear: () => {
    cache.clear();
  },
};
