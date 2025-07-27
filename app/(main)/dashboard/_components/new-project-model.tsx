import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { usePlanAccess } from "@/hooks/use-plan-access";
import useConvexQuerry from "@/hooks/use-querry-hook";
import React from "react";

function NewProjectModel({ isOpen, onClose }) {
  const handleClose = () => {
    onClose();
  };

  const { isFree, canCreateProject } = usePlanAccess();
  const { data: projects } = useConvexQuerry(api.projects.getUserProjects);
  const currentProjectCount = projects?.length || 0;
  const canCreate = canCreateProject(currentProjectCount);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Create new Project
            </DialogTitle>
            {isFree && (
              <Badge
                variant={"secondary"}
                className="bg-slate-700 text-white/70"
              >
                {currentProjectCount}/3 projects
              </Badge>
            )}
          </DialogHeader>
          <DialogFooter>footer</DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewProjectModel;
