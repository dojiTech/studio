export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
};

export const priorities: Task['priority'][] = ['high', 'medium', 'low'];
