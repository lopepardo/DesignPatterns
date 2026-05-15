type FileNode = {
  kind: "file";
  name: string;
  size: number;
};

type FolderNode = {
  kind: "folder";
  name: string;
  children: FileSystemNode[];
};

export type FileSystemNode = FileNode | FolderNode;

export const getSize = (node: FileSystemNode): number => {
  if (node.kind === "file") {
    return node.size;
  }

  return node.children.reduce((total, child) => total + getSize(child), 0);
};

export const printNode = (node: FileSystemNode, indent = 0): void => {
  if (node.kind === "file") {
    console.log(`${" ".repeat(indent)}- ${node.name} (${node.size} KB)`);
    return;
  }

  console.log(`${" ".repeat(indent)}+ ${node.name}/`);

  for (const child of node.children) {
    printNode(child, indent + 2);
  }
};
