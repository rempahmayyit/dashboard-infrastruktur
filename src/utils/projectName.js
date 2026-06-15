export const getDisplayName = (project) => {
  return (
    project?.short_project_name ||
    project?.nama_proyek_current ||
    project?.nama_paket_current ||
    project?.project_name ||
    "-"
  );
};