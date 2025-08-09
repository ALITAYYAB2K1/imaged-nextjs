"use client";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, Edit, Trash2 } from "lucide-react";
import { useConvexMutation } from "@/hooks/use-querry-hook";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
export default function ProjectCard({ project, onEdit }) {
  const { mutate: deleteProject, isLoading } = useConvexMutation(
    api.projects.deleteProject
  );
  const handleDelete = async () => {};
  const lastUpdated = formatDistanceToNow(new Date(project.updatedAt), {
    addSuffix: true,
  });
  return (
    <Card
      className="py-0 group relative bg-slate-800/50 overflow-hidden hover:border-white/20
    transition-all hover:transform hover:scale-[1.02]"
    >
      <div className="aspect-video bg-slate-700 relative overflow-hidden">
        {project.thumbnailUrl && (
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover "
          />
        )}
        <div>
          <Button
            onClick={onEdit}
            variant={"glass"}
            size={"sm"}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            variant={"glass"}
            size={"sm"}
            className="gap-2 text-red-400 hover:text-red-300"
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      <CardContent className="pb-6">
        <h3 className="font-semibold text-white mb-1 truncate">
          {project.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-white/70">
          <Badge
            className="text-xs text-white/70 bg-slate-700"
            variant="secondary"
          >
            {project.width} x {project.height}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
