import { Loader } from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMyTasksQuery } from "@/hooks/use-task";
import type { Task } from "@/types";
import { format } from "date-fns";
import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  FilterIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

const MyTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilter = searchParams.get("filter") || "all";
  const initialSort = searchParams.get("sort") || "desc";
  const initialSearch = searchParams.get("search") || "";

  const [filter, setFilter] = useState<string>(initialFilter);

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSort === "asc" ? "asc" : "desc"
  );

  const [search, setSearch] = useState<string>(initialSearch);

  useEffect(() => {
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    params.filter = filter;
    params.sort = sortDirection;
    params.search = search;

    setSearchParams(params, { replace: true });
  }, [filter, sortDirection, search]);

  useEffect(() => {
    const urlFilter = searchParams.get("filter") || "all";
    const urlSort = searchParams.get("sort") || "desc";
    const urlSearch = searchParams.get("search") || "";

    if (urlFilter !== filter) setFilter(urlFilter);

    if (urlSort !== sortDirection) {
      setSortDirection(urlSort === "asc" ? "asc" : "desc");
    }

    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  const { data: response, isLoading } = useGetMyTasksQuery() as {
    data: {
      status: number;
      message: string;
      data: Task[];
    };
    isLoading: boolean;
  };

  const myTasks = response?.data || [];

  const filteredTasks = myTasks
    ?.filter((task) => {
      if (filter === "all") return true;
      if (filter === "todo") return task.status === "To Do";
      if (filter === "inprogress")
        return task.status === "In Progress";
      if (filter === "done") return task.status === "Done";
      if (filter === "achieved")
        return task.isAchieved === true;
      if (filter === "high") return task.priority === "High";

      return true;
    })
    ?.filter((task) => {
      const title = task.title?.toLowerCase() || "";
      const description =
        task.description?.toLowerCase() || "";

      return (
        title.includes(search.toLowerCase()) ||
        description.includes(search.toLowerCase())
      );
    });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return sortDirection === "asc"
        ? new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime();
    }

    return 0;
  });

  const todoTasks = sortedTasks.filter(
    (task) => task.status === "To Do"
  );

  const inProgressTasks = sortedTasks.filter(
    (task) => task.status === "In Progress"
  );

  const doneTasks = sortedTasks.filter(
    (task) => task.status === "Done"
  );

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center justify-between">
        <h1 className="text-2xl font-bold">My Tasks</h1>

        <div className="flex flex-col items-start md:flex-row gap-2">
          <Button
            variant={"outline"}
            onClick={() =>
              setSortDirection(
                sortDirection === "asc" ? "desc" : "asc"
              )
            }
          >
            {sortDirection === "asc"
              ? "Oldest First"
              : "Newest First"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                <FilterIcon className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>
                Filter Tasks
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setFilter("all")}
              >
                All Tasks
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setFilter("todo")}
              >
                To Do
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setFilter("inprogress")}
              >
                In Progress
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setFilter("done")}
              >
                Done
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setFilter("achieved")}
              >
                Achieved
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setFilter("high")}
              >
                High Priority
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">
            List View
          </TabsTrigger>

          <TabsTrigger value="board">
            Board View
          </TabsTrigger>
        </TabsList>

        {/* LIST VIEW */}

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>

              <CardDescription>
                {sortedTasks.length} tasks assigned to you
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="divide-y">
                {sortedTasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-4 hover:bg-muted/50"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex gap-3">
                        <div className="mt-1">
                          {task.status === "Done" ? (
                            <CheckCircle className="size-4 text-green-500" />
                          ) : (
                            <Clock className="size-4 text-yellow-500" />
                          )}
                        </div>

                        <div>
                          <Link
                            to={`/workspaces/${task.project?.workspace}/projects/${task.project?._id}/tasks/${task._id}`}
                            className="font-medium hover:text-primary hover:underline flex items-center"
                          >
                            {task.title}

                            <ArrowUpRight className="size-4 ml-1" />
                          </Link>

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge
                              variant={
                                task.status === "Done"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {task.status}
                            </Badge>

                            {task.priority && (
                              <Badge
                                variant={
                                  task.priority === "High"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {task.priority}
                              </Badge>
                            )}

                            {task.isAchieved && (
                              <Badge variant="outline">
                                Archived
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        {task.dueDate && (
                          <div>
                            Due:{" "}
                            {format(
                              new Date(task.dueDate),
                              "PPPP"
                            )}
                          </div>
                        )}

                        <div>
                          Project:{" "}
                          <span className="font-medium">
                            {task.project?.title}
                          </span>
                        </div>

                        {task.updatedAt && (
                          <div>
                            Modified on:{" "}
                            {format(
                              new Date(task.updatedAt),
                              "PPPP"
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {sortedTasks.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No tasks found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BOARD VIEW */}

        <TabsContent value="board">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "To Do",
                tasks: todoTasks,
              },
              {
                title: "In Progress",
                tasks: inProgressTasks,
              },
              {
                title: "Done",
                tasks: doneTasks,
              },
            ].map((section) => (
              <Card key={section.title}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {section.title}

                    <Badge variant={"outline"}>
                      {section.tasks.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                  {section.tasks.map((task) => (
                    <Card
                      key={task._id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <Link
                          to={`/workspaces/${task.project?.workspace}/projects/${task.project?._id}/tasks/${task._id}`}
                          className="block space-y-3"
                        >
                          <div>
                            <h3 className="font-medium">
                              {task.title}
                            </h3>

                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {task.description ||
                                "No description"}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {task.priority && (
                              <Badge
                                variant={
                                  task.priority === "High"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {task.priority}
                              </Badge>
                            )}

                            {task.dueDate && (
                              <span className="text-sm text-muted-foreground">
                                {format(
                                  new Date(task.dueDate),
                                  "PPPP"
                                )}
                              </span>
                            )}
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}

                  {section.tasks.length === 0 && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No tasks found
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTasks;