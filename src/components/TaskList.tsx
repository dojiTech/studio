import { Task } from "@/lib/types";
import TaskItem from "./TaskItem";

type TaskListProps = {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSetPriority: (id: string, priority: Task['priority']) => void;
};

const priorityOrder: Record<Task['priority'], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export default function TaskList({ tasks, onToggleTask, onDeleteTask, onSetPriority }: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (a.completed === false) {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
    }
    return b.createdAt - a.createdAt;
  });
  
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 rounded-lg bg-muted/50">
        <p className="text-muted-foreground">You have no tasks. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedTasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onToggleTask={onToggleTask} 
          onDeleteTask={onDeleteTask} 
          onSetPriority={onSetPriority}
        />
      ))}
    </div>
  );
}
