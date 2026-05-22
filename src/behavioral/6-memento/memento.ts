export type DocumentState = {
  content: string;
  title: string;
};

export const updateContent = (
  state: DocumentState,
  content: string,
): DocumentState => {
  return {
    ...state,
    content,
  };
};

export class StateHistory<T> {
  private past: T[] = [];

  push(state: T): void {
    this.past.push(structuredClone(state));
  }

  pop(): T | undefined {
    return this.past.pop();
  }
}
