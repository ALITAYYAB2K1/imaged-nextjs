"use client";
import { CanvasContext } from "@/context/context";
import { api } from "@/convex/_generated/api";
import useConvexQuerry from "@/hooks/use-querry-hook";
import { Loader2, Monitor } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { RingLoader } from "react-spinners";
import CanvasEditor from "./_components/canvas";
const Editor = () => {
  const params = useParams();
  const projectId = params.projectId;
  const [canvasEditor, setCanvasEditor] = useState(null);
  const [processingMessage, setProcessingMessage] = useState(null);
  const [activeTool, setActiveTool] = useState("resize");

  const {
    data: project,
    isLoading,
    error,
  } = useConvexQuerry(api.projects.getProject, { projectId });
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-16 w-16 animate-spin text-cyan-400" />
          <p className="text-white">Loading project...</p>
        </div>
      </div>
    );
  }
  if (error || !project) {
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-cent">
        <h1 className="text-2xl font-bold text-white mb-2">
          Project not Found
        </h1>
        <p className="text-white/70 text-lg">
          The project you are trying to access does not exist or has been
          deleted.
        </p>
      </div>
    </div>;
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasEditor,
        setCanvasEditor,
        activeTool,
        onToolChange: setActiveTool,
        processingMessage,
        setProcessingMessage,
      }}
    >
      <div className="lg:hidden min-h-screen bg-slate-900 flex items-center justify-center">
        <div>
          <Monitor className="h-16 w-16 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4 italic">
            Desktop Required
          </h1>
          <p className="text-white/70 text-lg mb-2">
            This application is designed to work on a desktop environment.
          </p>
          <p className="text-white/70 text-sm ">
            please use larger screens to access{" "}
            <strong>this application</strong>.
          </p>
        </div>
      </div>
      <div className="hidden lg:block min-h-screen bg-slate-900 p-0">
        <div className="flex flex-col h-screen">
          {processingMessage && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center">
              <div className="rounded-lg p-6 flex flex-col items-center gap-4">
                <RingLoader color="#fff" />
                <div className="text-center">
                  <p className="text-white font-medium">{processingMessage}</p>
                  <p className="text-white/70 text-sm mt-1">
                    please wait while we process your request...
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* TopBar */}
          <div className="flex flex-1 overflow-hidden">
            {/* SideBar */}
            <div className="flex-1 bg-slate-800">
              <CanvasEditor project={project} />
            </div>
          </div>
        </div>
      </div>
    </CanvasContext.Provider>
  );
};

export default Editor;
