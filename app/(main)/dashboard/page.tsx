"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";

function Dashboard() {
  const data = useQuery(api.projects.getUserProjects);
  console.log("Projects Data:", data);
  return <div> Dashboard</div>;
}

export default Dashboard;
