"use client";

import { useState } from "react";
import { Task, priorities } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TaskItemProps = {
  task: Task;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSetPriority: (id: string, priority: Task['priority']) => void;
};

const priorityColors: Record<Task['priority'], string> = {
  high: "bg-red-500 border-red-500 hover:bg-red-600",
  medium: "bg-yellow-500 border-yellow-500 hover:bg-yellow-600",
  low: "bg-blue-500 border-blue-500 hover:bg-blue-600",
};

export default function TaskItem({ task, onToggleTask, onDeleteTask, onSetPriority }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "transition-all duration-300 rounded-lg border p-4 flex flex-col group",
        task.completed ? "bg-card/50" : "bg-card shadow-sm"
      )}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={() => onToggleTask(task.id)}
          className="mt-1"
          aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="flex-1 space-y-1 overflow-hidden" onClick={() => setIsExpanded(!isExpanded)}>
          <p className={cn(
            "font-medium transition-all cursor-pointer",
            task.completed ? "line-through text-muted-foreground" : "text-foreground"
          )}>
            {task.title}
          </p>
          {task.description && (
            <div className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isExpanded ? "max-h-40 pt-1" : "max-h-0"
            )}>
              <p className={cn(
                "text-sm",
                task.completed ? "text-muted-foreground/80" : "text-muted-foreground"
              )}>
                {task.description}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge
                variant="default"
                className={cn(
                  "capitalize cursor-pointer text-white",
                  priorityColors[task.priority],
                  task.completed && "opacity-60"
                )}
              >
                {task.priority}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {priorities.map(p => (
                <DropdownMenuItem key={p} onSelect={() => onSetPriority(task.id, p)} className="capitalize cursor-pointer">
                  <span>{p}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {task.description && (
            <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex" onClick={(e) => {e.stopPropagation(); setIsExpanded(!isExpanded);}}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">{isExpanded ? 'Collapse' : 'Expand'}</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-8 w-8"
            onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
            aria-label={`Delete task ${task.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
