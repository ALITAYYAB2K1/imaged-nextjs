"use client";

import { useParallax } from "@/hooks/use-parallex";
import React from "react";

function FloatingShapes() {
  const scrollY = useParallax();
  const shapes = [
    {
      id: 1,
      size: "w-72 h-72",
      position: "top-20 left-10",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      id: 2,
      size: "w-96 h-96",
      position: "top-1/3 right-10",
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      id: 3,
      size: "w-64 h-64",
      position: "bottom-20 left-1/4",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 4,
      size: "w-80 h-80",
      position: "bottom-1/3 right-1/4",
      gradient: "from-green-400 to-cyan-500",
    },
    {
      id: 5,
      size: "w-56 h-56",
      position: "top-1/14 left-1/2",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      id: 6,
      size: "w-48 h-48",
      position: "bottom-1/4 right-1/2",
      gradient: "from-red-400 to-yellow-500",
    },
  ];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={`absolute ${shape.position} ${shape.size} 
            bg-gradient-to-r ${shape.gradient} rounded-full
            blur-3xl opacity-20 animate-pulse`}
          style={{
            transform: `translateY(${scrollY * 0.1}px) rotate(${
              scrollY * 0.5
            }deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default FloatingShapes;
