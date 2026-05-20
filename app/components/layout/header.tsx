import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { Button } from "../ui/button";
import { Bell, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";
import { useEffect } from "react";

interface HeaderProps {
  onWorkspaceSelected: (workspace: Workspace) => void;
  selectedWorkspace: Workspace | null;
  onCreateWorkspace: () => void;
}

export const Header = ({
  onWorkspaceSelected,
  selectedWorkspace,
  onCreateWorkspace,
}: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const { workspaces } = useLoaderData() as {
    workspaces: Workspace[];
  };

  const isOnWorkspacePage =
    location.pathname.includes("/workspaces");

  // restore selected workspace after refresh
  useEffect(() => {
    const savedWorkspaceId = localStorage.getItem(
      "selectedWorkspaceId"
    );

    if (
      savedWorkspaceId &&
      !selectedWorkspace &&
      workspaces?.length
    ) {
      const workspace = workspaces.find(
        (ws) => ws._id === savedWorkspaceId
      );

      if (workspace) {
        onWorkspaceSelected(workspace);
      }
    }
  }, [workspaces, selectedWorkspace]);

  const handleOnClick = (workspace: Workspace) => {
    // save selected workspace
    localStorage.setItem(
      "selectedWorkspaceId",
      workspace._id
    );

    localStorage.setItem(
      "selectedWorkspace",
      JSON.stringify(workspace)
    );

    // update state
    onWorkspaceSelected(workspace);

    // navigate
    navigate(`/workspaces/${workspace._id}`);
  };

  return (
    <div className="bg-background sticky top-0 z-40 border-b">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              {selectedWorkspace ? (
                <>
                  {selectedWorkspace.color && (
                    <WorkspaceAvatar
                      color={selectedWorkspace.color}
                      name={selectedWorkspace.name}
                    />
                  )}

                  <span className="font-medium">
                    {selectedWorkspace.name}
                  </span>
                </>
              ) : (
                <span className="font-medium">
                  Select Workspace
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>
              Workspace
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {workspaces?.map((ws) => (
                <DropdownMenuItem
                  key={ws._id}
                  onClick={() => handleOnClick(ws)}
                >
                  {ws.color && (
                    <WorkspaceAvatar
                      color={ws.color}
                      name={ws.name}
                    />
                  )}

                  <span className="ml-2">
                    {ws.name}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={onCreateWorkspace}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full border p-1 w-8 h-8">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={user?.username}
                  />

                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.username
                      ?.charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                My Account
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Link to="/user/profile">
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={logout}>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};