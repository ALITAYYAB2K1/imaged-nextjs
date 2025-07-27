import { useAuth } from "@clerk/nextjs";
import { text } from "stream/consumers";

export function usePlanAccess() {
  const { has } = useAuth();
  const isPro = has?.({ plan: "pro" }) || false;

  const isFree = !isPro;

  const planAccess = {
    resize: true,
    crop: true,
    adjust: true,
    text: true,

    // Pro features
    background: isPro,
    ai_extender: isPro,
    ai_edit: isPro,
  };

  const hasAccess = (toolId) => {
    return planAccess[toolId] === true;
  };

  const getRestrictedTools = () => {
    return Object.entries(planAccess)
      .filter(([_, hasAccess]) => !hasAccess)
      .map(([toolId]) => toolId);
  };

  const canCreateProject = (currentProjectCount) => {
    if (isPro) return true;
    // Assuming we have a way to get the current user's project count
    // Replace with actual logic to get project count
    return currentProjectCount < 5; // Free plan limit
  };
  const canExport = (exportCountThisMonth) => {
    if (isPro) return true;
  };
  return {
    isPro,
    isFree,
    hasAccess,
    planAccess,
    getRestrictedTools,
    canCreateProject,
    canExport,
  };
}
