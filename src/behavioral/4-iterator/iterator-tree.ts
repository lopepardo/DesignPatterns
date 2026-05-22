export type CategoryNode = {
  name: string;
  children: CategoryNode[];
};

export function* traverseDepthFirst(
  node: CategoryNode,
): Generator<CategoryNode> {
  yield node;

  for (const child of node.children) {
    yield* traverseDepthFirst(child);
  }
}
