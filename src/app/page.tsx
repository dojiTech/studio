"use client";

import { useState, useEffect } from "react";
import { Task } from "@/lib/types";
import AddTaskForm from "@/components/AddTaskForm";
import TaskList from "@/components/TaskList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([
          { id: "1", title: "Set up project", description: "Initialize Next.js app and install dependencies.", completed: true, priority: "high", createdAt: Date.now() - 200000 },
          { id: "2", title: "Create UI components", description: "Build React components for tasks.", completed: true, priority: "high", createdAt: Date.now() - 100000 },
          { id: "3", title: "Integrate AI suggestions", description: "Use Genkit to suggest similar tasks.", completed: false, priority: "medium", createdAt: Date.now() },
          { id: "4", title: "Deploy to Firebase", completed: false, priority: "low", createdAt: Date.now() + 100000 },
        ]);
      }
    } catch (error) {
        console.error("Could not load tasks from local storage", error)
    }
  }, []);

  useEffect(() => {
    try {
        if (tasks.length > 0) {
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    } catch (error) {
        console.error("Could not save tasks to local storage", error)
    }
  }, [tasks]);

  const handleAddTask = (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleAddMultipleTasks = (tasksToAdd: Omit<Task, 'id' | 'completed' | 'createdAt'>[]) => {
    const newTasks: Task[] = tasksToAdd.map(task => ({
      ...task,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: Date.now(),
    }));
    setTasks((prev) => [...newTasks, ...prev]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const handleSetPriority = (id: string, priority: Task['priority']) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, priority } : task
      )
    );
  };

  return (
    <main className="min-h-screen bg-background flex items-start justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <CheckSquare className="text-primary w-8 h-8" />
            Task Master
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddTaskForm onAddTask={handleAddTask} onAddMultipleTasks={handleAddMultipleTasks} />
          <TaskList
            tasks={tasks}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            onSetPriority={handleSetPriority}
          />
        </CardContent>
      </Card>
    </main>
  );
}
