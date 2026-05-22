type Task = {
  id: string;
  title: string;
};

class TaskIterator {
  private currentIndex = 0;

  constructor(private readonly tasks: Task[]) {}

  hasNext(): boolean {
    return this.currentIndex < this.tasks.length;
  }

  next(): Task {
    const task = this.tasks[this.currentIndex]!;
    this.currentIndex++;
    return task;
  }
}

export class TaskCollection {
  private readonly tasks: Task[] = [];

  add(task: Task): void {
    this.tasks.push(task);
  }

  createIterator(): TaskIterator {
    return new TaskIterator(this.tasks);
  }
}
