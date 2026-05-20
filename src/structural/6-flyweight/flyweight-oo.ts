type TreeType = {
  name: string;
  color: string;
  texture: string;
  draw(x: number, y: number): void;
};

export class TreeTypeFactory {
  private readonly treeTypes = new Map<string, TreeType>();

  getTreeType(name: string, color: string, texture: string): TreeType {
    const key = `${name}-${color}-${texture}`;

    const existing = this.treeTypes.get(key);

    if (existing) {
      return existing;
    }

    const treeType: TreeType = {
      name,
      color,
      texture,

      draw(x, y) {
        console.log(`Dibujando ${name} en (${x}, ${y}) con textura ${texture}`);
      },
    };

    this.treeTypes.set(key, treeType);

    return treeType;
  }

  count(): number {
    return this.treeTypes.size;
  }
}

export type TreeOO = {
  x: number;
  y: number;
  type: TreeType;
};
