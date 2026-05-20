import { RecentProjects } from "@/components/dashboard/recnt-projects";
import { StatsCard } from "@/components/dashboard/stat-card";
import { StatisticsCharts } from "@/components/dashboard/statistics-charts";
import { Loader } from "@/components/loader";
import { UpcomingTasks } from "@/components/upcoming-tasks";
import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types";
import { useSearchParams } from "react-router";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const workspaceId =
    searchParams.get("workspaceId") ||
    localStorage.getItem("selectedWorkspaceId");
  const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId || "") as {
    data: {
      status: number;
      message: string;
      data: {
        stats: StatsCardProps;
        taskTrendsData: TaskTrendsData[];
        projectStatusData: ProjectStatusData[];
        taskPriorityData: TaskPriorityData[];
        workspaceProductivityData: WorkspaceProductivityData[];
        upcomingTasks: Task[];
        recentProjects: Project[];
      };
    };
    isPending: boolean;
  };
  if (isPending || !data) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8 2xl:space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <StatsCard data={data.data.stats} />

      <StatisticsCharts
        stats={data.data.stats}
        taskTrendsData={data.data.taskTrendsData}
        projectStatusData={data.data.projectStatusData}
        taskPriorityData={data.data.taskPriorityData}
        workspaceProductivityData={data.data.workspaceProductivityData}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProjects data={data.data.recentProjects} />
        <UpcomingTasks data={data.data.upcomingTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
