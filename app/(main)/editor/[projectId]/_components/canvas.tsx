import { useCanvas } from "@/context/context";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-querry-hook";
import { set } from "date-fns";
import { Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, FabricImage } from "fabric"; // Assuming you're using fabric.js for canvas manipulation

const CanvasEditor = ({ project }) => {
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { canvasEditor, setCanvasEditor, activeTool, onToolChange } =
    useCanvas();

  const { mutate: updateProject } = useConvexMutation(
    api.projects.updateProject
  );
  const calculateViewportScale = () => {
    if (!containerRef.current || !project) return 1;
    const container = containerRef.current;
    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 40;
    const scaleX = containerWidth / project.width;
    const scaleY = containerHeight / project.height;
    return Math.min(scaleX, scaleY, 1);
  };
  useEffect(() => {
    if (!canvasRef.current || !project || canvasEditor) return;
    const initializeCanvas = async () => {
      setIsLoading(true);
      const viewportScale = calculateViewportScale();
      const canvas = new Canvas(canvasRef.current, {
        width: project.width,
        height: project.height,

        backgroundColor: "#ffffff", //white background default
        preserveObjectStacking: true,
        controlsAboveOverlay: true,
        selection: true,
        hoverCursor: "move",
        moveCursor: "move",
        defaultCursor: "default",
        allowTouchScrolling: false,
        renderOnAddRemove: true,
        skipTargetFind: false,
      });
      canvas.setDimensions(
        {
          width: project.width * viewportScale,
          height: project.height * viewportScale,
        },
        { backstoreOnly: false }
      );
      canvas.setZoom(viewportScale);
      const scaleFactor = window.devicePixelRatio || 1;
      if (scaleFactor > 1) {
        canvas.getElement().width = project.width * scaleFactor;
        canvas.getElement().height = project.height * scaleFactor;

        canvas.getContext().scale(scaleFactor, scaleFactor);
      }
      if (project.currentImageUrl || project.originalImageUrl) {
        try {
          const imageUrl = project.currentImageUrl || project.originalImageUrl;
          const fabricImage = await FabricImage.fromURL(imageUrl, {
            crossOrigin: "anonymous",
          });
          const imgAspectRatio = fabricImage.width / fabricImage.height;
          const canvasAspectRatio = project.width / project.height;
          let scaleX, scaleY;
          if (imgAspectRatio > canvasAspectRatio) {
            // image is wider than canvas - scale based on width
            scaleX = project.width / fabricImage.width;
            scaleY = scaleX; // maintain aspect ratio
          } else {
            // image is taller than canvas - scale based on height
            scaleY = project.height / fabricImage.height;
            scaleX = scaleY; // maintain aspect ratio
          }
          fabricImage.set({
            left: project.width / 2,
            top: project.height / 2,
            originX: "center",
            originY: "center",
            scaleX,
            scaleY,
            selectable: true,
            evented: true,
          });
          canvas.add(fabricImage);
          canvas.centerObject(fabricImage);
        } catch (error) {
          console.error("Error loading image:", error);
        }
      }
      if (project.canvasState) {
        try {
          // load JSON state - this will restore all objects and their properties
          await canvas.loadFromJSON(project.canvasState);
          canvas.requestRenderAll(); // force re-render after loading state
        } catch (error) {
          console.error("Error loading canvas state:", error);
        }
      }
      canvas.calcOffset(); // recalculate canvas position for event handling
      canvas.requestRenderAll(); // trigger initial re-render
      setCanvasEditor(canvas);
      setIsLoading(false);
    };
    initializeCanvas();
    return () => {
      if (canvasEditor) {
        canvasEditor.dispose();
        setCanvasEditor(null);
      }
    };
  }, [project]);

  return (
    <div
      ref={containerRef}
      className="relative justify-center flex items-center h-full bg-secondary w-full overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #64748b 25%, transparent 25%),
            linear-gradient(-45deg, #64748b 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #64748b 75%),
            linear-gradient(-45deg, transparent 75%, #64748b 75%)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin w-8 h-8" />
            <p className="text-white/70 text-sm">Loading canvas...</p>
          </div>
        </div>
      )}
      <div className="px-5">
        <canvas ref={canvasRef} id="canvas" className="border" />
      </div>
    </div>
  );
};

export default CanvasEditor;
