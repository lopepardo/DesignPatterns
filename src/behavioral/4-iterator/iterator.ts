type Task = {
  id: string;
  title: string;
};

export class TaskCollectionTs implements Iterable<Task> {
  private tasks: Task[] = [];

  add(task: Task): void {
    this.tasks.push(task);
  }

  *[Symbol.iterator](): Iterator<Task> {
    for (const task of this.tasks) {
      yield task;
    }
  }
}
