"use client";
import { useParams } from "next/navigation";
import React from "react";

const Editor = async () => {
  const params = await useParams();
  return <div>Editing project: {params.projectId}</div>;
};

export default Editor;
