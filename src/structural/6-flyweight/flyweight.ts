type TreeType = {
  name: string;
  color: string;
  texture: string;
};

export const createTreeTypeRegistry = () => {
  const cache = new Map<string, TreeType>();

  return {
    get(name: string, color: string, texture: string): TreeType {
      const key = JSON.stringify({ name, color, texture });

      const existing = cache.get(key);

      if (existing) {
        return existing;
      }

      const treeType = {
        name,
        color,
        texture,
      };

      cache.set(key, treeType);

      return treeType;
    },

    size() {
      return cache.size;
    },
  };
};

export type Tree = {
  x: number;
  y: number;
  type: TreeType;
};
