"use client";
import { useParams } from "next/navigation";
import React from "react";

const Editor = () => {
  const params = useParams();
  const projectId = params.projectId;
  return (
    <>
      <h1>Editing project: {projectId}</h1>
    </>
  );
};

export default Editor;
