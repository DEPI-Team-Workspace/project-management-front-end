import type { CreateTaskFormData } from "@/components/task/create-task-dialog";
import { fetchData, postData, updateData } from "@/lib/fetch-util";
import type { TaskPriority, TaskStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { projectId: string; taskData: CreateTaskFormData }) =>
      postData(`/task/${data.projectId}/create-task`, data.taskData),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["project", data.project],
      });
    },
  });
};

export const useTaskByIdQuery = (taskId: string) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchData(`/task/${taskId}`),
  });
};

export const useUpdateTaskTitleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; title: string }) =>
      updateData(`/task/${data.taskId}/title`, { title: data.title }),
    onSuccess: (_data, variables) => {
  queryClient.invalidateQueries({
    queryKey: ["task", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["task-activity", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["comments", variables.taskId],
  });
}
  });
};

export const useUpdateTaskStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; status: TaskStatus }) =>
      updateData(`/task/${data.taskId}/status`, { status: data.status }),
    onSuccess: (_data, variables) => {
  queryClient.invalidateQueries({
    queryKey: ["task", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["task-activity", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["comments", variables.taskId],
  });
}
  });
};

export const useUpdateTaskDescriptionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; description: string }) =>
      updateData(`/task/${data.taskId}/description`, {
        description: data.description,
      }),
    onSuccess: (_data, variables) => {
  queryClient.invalidateQueries({
    queryKey: ["task", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["task-activity", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["comments", variables.taskId],
  });
}
  });
};

export const useUpdateTaskAssigneesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; assignees: string[] }) =>
      updateData(`/task/${data.taskId}/assignees`, {
        assignees: data.assignees,
      }),
    onSuccess: (_data, variables) => {
  queryClient.invalidateQueries({
    queryKey: ["task", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["task-activity", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["comments", variables.taskId],
  });
}
  });
};

export const useUpdateTaskPriorityMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; priority: TaskPriority }) =>
      updateData(`/task/${data.taskId}/priority`, { priority: data.priority }),
    onSuccess: (_data, variables) => {
  queryClient.invalidateQueries({
    queryKey: ["task", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["task-activity", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["comments", variables.taskId],
  });
}
  });
};

export const useAddSubTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; title: string }) =>
      postData(`/task/${data.taskId}/add-subtask`, { title: data.title }),
    onSuccess: (_data, variables) => {
  queryClient.invalidateQueries({
    queryKey: ["task", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["task-activity", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["comments", variables.taskId],
  });
}
  });
};

export const useUpdateSubTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      taskId: string;
      subTaskId: string;
      completed: boolean;
    }) =>
      updateData(`/task/${data.taskId}/update-subtask/${data.subTaskId}`, {
        completed: data.completed,
      }),
    onSuccess: (_data, variables) => {
  queryClient.invalidateQueries({
    queryKey: ["task", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["task-activity", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["comments", variables.taskId],
  });
}
  });
};

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; text: string }) =>
      postData(`/task/${data.taskId}/add-comment`, { text: data.text }),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["task-activity", variables.taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
    },
  });
};

export const useGetCommentsByTaskIdQuery = (taskId: string) => {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => fetchData(`/task/${taskId}/comments`),
  });
};

export const useWatchTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string }) =>
      postData(`/task/${data.taskId}/watch`, {}),
    onSuccess: (_data, variables) => {
  queryClient.invalidateQueries({
    queryKey: ["task", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["task-activity", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["comments", variables.taskId],
  });
}
  });
};

export const useAchievedTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string }) =>
      postData(`/task/${data.taskId}/achieved`, {}),
    onSuccess: (_data, variables) => {
  queryClient.invalidateQueries({
    queryKey: ["task", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["task-activity", variables.taskId],
  });

  queryClient.invalidateQueries({
    queryKey: ["comments", variables.taskId],
  });
}
  });
};

export const useGetMyTasksQuery = () => {
  return useQuery({
    queryKey: ["my-tasks", "user"],
    queryFn: () => fetchData("/task/my-tasks"),
  });
};
