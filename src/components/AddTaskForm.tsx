"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { priorities, Task } from "@/lib/types";
import { suggestSimilarTasks } from "@/ai/flows/suggest-similar-tasks";
import { Sparkles, Loader2, ListPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long.").max(100, "Title is too long."),
  description: z.string().max(500, "Description is too long.").optional(),
  priority: z.enum(priorities),
});

type AddTaskFormProps = {
  onAddTask: (task: Omit<Task, "id" | "completed" | "createdAt">) => void;
  onAddMultipleTasks: (tasks: Omit<Task, "id" | "completed" | "createdAt">[]) => void;
};

export default function AddTaskForm({ onAddTask, onAddMultipleTasks }: AddTaskFormProps) {
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  const handleSuggestTasks = async () => {
    const title = form.getValues("title");
    if (title.length < 3) {
      toast({
        title: "Title too short",
        description: "Please enter a title with at least 3 characters to get suggestions.",
        variant: "destructive",
      });
      return;
    }
    setIsLoadingSuggestions(true);
    setSuggestions([]);
    setSelectedSuggestions([]);
    try {
      const result = await suggestSimilarTasks({ taskName: title });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Failed to get suggestions:", error);
      toast({
        title: "Error",
        description: "Could not fetch AI suggestions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSuggestionToggle = (suggestion: string, checked: boolean) => {
    setSelectedSuggestions(prev =>
      checked ? [...prev, suggestion] : prev.filter(s => s !== suggestion)
    );
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const tasksToAdd: Omit<Task, "id" | "completed" | "createdAt">[] = [{ ...values, title: values.title.trim() }];

    selectedSuggestions.forEach(suggestion => {
      tasksToAdd.push({
        title: suggestion,
        priority: values.priority,
        description: ""
      });
    });

    if (tasksToAdd.length > 1) {
      onAddMultipleTasks(tasksToAdd);
    } else {
      onAddTask(tasksToAdd[0]);
    }

    form.reset();
    setSuggestions([]);
    setSelectedSuggestions([]);
  };

  return (
    <div className="mb-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Plan a new marketing campaign" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Add more details about the task..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p} value={p} className="capitalize">
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90 flex-shrink-0">
              Add Task
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSuggestTasks}
              disabled={isLoadingSuggestions}
              className="text-accent-foreground bg-accent/90 border-accent/90 hover:bg-accent flex-shrink-0"
            >
              {isLoadingSuggestions ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              AI Suggestions
            </Button>
          </div>
        </form>
      </Form>

      {isLoadingSuggestions && (
        <div className="mt-6 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          <p className="text-muted-foreground mt-2">Generating ideas...</p>
        </div>
      )}

      {suggestions.length > 0 && !isLoadingSuggestions && (
        <Card className="mt-6 bg-card/70">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <ListPlus className="w-5 h-5 text-primary" />
              Add Suggested Tasks
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Select any additional tasks you'd like to create.</p>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                  <Checkbox
                    id={`suggestion-${index}`}
                    onCheckedChange={(checked) => handleSuggestionToggle(suggestion, !!checked)}
                    checked={selectedSuggestions.includes(suggestion)}
                  />
                  <label
                    htmlFor={`suggestion-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                  >
                    {suggestion}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      <Separator className="my-8" />
    </div>
  );
}
