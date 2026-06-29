export const getDisplayName = (project) => {
  return (
    project?.short_project_name ||
    project?.display_name ||
    project?.project_name ||
    "-"
  );
};