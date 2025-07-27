"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React, { useState } from "react";
import useConvexQuerry from "@/hooks/use-querry-hook";
import { useConvexMutation } from "@/hooks/use-querry-hook";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { BarLoader } from "react-spinners";
import type { Doc } from "@/convex/_generated/dataModel";

function Dashboard() {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const {
    data: projects,
    isLoading,
    error,
  } = useConvexQuerry<Doc<"projects">[]>(api.projects.getUserProjects);
  console.log("Projects Data:", projects);
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Your projects
            </h1>
            <p className="text-white/70">
              Create and Manage your AI-powered image design
            </p>
          </div>

          <Button
            onClick={() => setShowNewProjectModal(true)}
            className="mt-4"
            variant="primary"
            size={"lg"}
          >
            <Plus className="h-5 w-5" />
            Create New Project
          </Button>
        </div>
        {isLoading ? (
          <BarLoader width={"100%"} color="white" className="mx-auto" />
        ) : projects && projects.length > 0 ? (
          <></>
        ) : (
          <div className="text-center mt-16">
            <h3 className="text-center text-white/70 text-2xl font-semibold mb-3">
              Create your first project to get started!
            </h3>
            <p className="text-center text-white/50 mb-6">
              Upload an image to start editing with our AI-powered tools.
            </p>
            <Button
              onClick={() => setShowNewProjectModal(true)}
              className="mt-4"
              variant="primary"
              size={"xl"}
            >
              <Sparkles className="h-5 w-5" />
              start creating
            </Button>
          </div>
        )}
        {/* <NewProjectModel /> */}
      </div>
    </div>
  );
}

export default Dashboard;
