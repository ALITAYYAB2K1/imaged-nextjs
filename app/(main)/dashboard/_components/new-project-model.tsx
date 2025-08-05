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
import useConvexQuerry, { useConvexMutation } from "@/hooks/use-querry-hook";
import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Crown,
  ImageIcon,
  Loader2,
  Terminal,
  Trash,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import type { Doc } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface NewProjectModelProps {
  isOpen: boolean;
  onClose: () => void;
}

function NewProjectModel({ isOpen, onClose }: NewProjectModelProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProjectTitle("");
    setIsUploading(false);
    onClose();
  };

  const { isFree, canCreateProject } = usePlanAccess();
  const { data: projects } = useConvexQuerry<Doc<"projects">[]>(
    api.projects.getUserProjects
  );
  const currentProjectCount = projects?.length || 0;
  const canCreate = canCreateProject(currentProjectCount);
  const { mutate: createProject } = useConvexMutation(api.projects.create);
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Create a preview URL for the image
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      setProjectTitle(nameWithoutExtension || "Untitled Project"); // Set the project title to the file name without extension
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };
  const handleCreateProject = async () => {
    if (!canCreate) {
      setShowUpgradeModal(true);
      return;
    }
    if (!selectedFile || !projectTitle.trim()) {
      toast.error("Please select an image and enter a project title.");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("filename", selectedFile.name);
      formData.append("title", projectTitle);

      await createProject(formData);
      toast.success("Project created successfully!");
      handleClose();
    } catch (error) {}
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    maxSize: 30 * 1024 * 1024, // 30 MB
  });
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
                {currentProjectCount}/5 projects
              </Badge>
            )}
          </DialogHeader>
          <div className="space-y-6">
            {isFree && currentProjectCount >= 4 && (
              <Alert className="bg-amber-500/10 border-amber-500/20">
                <Crown className="text-amber-400 h-5 w-5" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription className="text-amber-300/80">
                  <div className="font-semibold text-amber-400 mb-1">
                    {currentProjectCount === 4
                      ? "Last project on free plan"
                      : "Project Limit Reached"}
                  </div>
                  <div>
                    {currentProjectCount === 4
                      ? "This will be your last project on the free plan. Upgrade to Pro for unlimited projects."
                      : "Free plan is limited to 5 projects. Upgrade to Imaged Pro for unlimited projects."}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Upload Area */}
            {!selectedFile ? (
              <div
                {...getRootProps()}
                className="border-dashed border-2 border-white/20 rounded-lg p-8 text-center cursor-pointer"
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-white/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isDragActive ? "Drop the file here..." : "Upload an image"}
                </h3>
                <p className="text-white/70 mb-4">
                  {canCreate
                    ? "Drag and drop an image file here, or click to select a file."
                    : "Upgrade to Pro to to create more projects."}
                </p>{" "}
                <p className="text-sm text-white/50">
                  Supports PNG , JPG , WEBP up to 30MB
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-xl border border-white/10"
                    />
                  )}
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setProjectTitle("");
                    }}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-red-100 cursor-pointer"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="project-title"
                    className="text-white font-semibold"
                  >
                    Project Title
                  </Label>
                  <Input
                    id="project-title"
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="Enter project title...."
                    className="bg-transparent border border-white/20 focus:border-white focus:ring-0"
                  />
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 ">
                    <ImageIcon className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="text-white font-medium">
                        {selectedFile?.name}
                      </p>
                      <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant={"ghost"}
              onClick={handleClose}
              disabled={isUploading}
              className="text-white/70 hover:text-white cursor-pointer"
            >
              cancel
            </Button>

            <Button
              onClick={handleCreateProject}
              disabled={isUploading || !projectTitle.trim() || !selectedFile}
              variant={"primary"}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating....
                </>
              ) : (
                <>Create Project</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewProjectModel;
