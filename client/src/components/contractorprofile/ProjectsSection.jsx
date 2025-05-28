import { Grid, Typography, Button } from "@mui/material";
import { CirclePlus } from "lucide-react";
import ProjectCard from "./ProjectCard";

const ProjectsSection = ({
  projects,
  isOwnerView,
  setOpenProjectDialog,
  setSelectedProject,
  setCurrentImageIndex
}) => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Projects</h3>
        {isOwnerView && (
          <Button
            onClick={() => setOpenProjectDialog(true)}
            startIcon={<CirclePlus size={18} />}
            variant="contained"
          >
            Add Project
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <Typography variant="body1" color="textSecondary">
            No projects found
          </Typography>
        </div>
      ) : (
        <Grid container spacing={2}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <ProjectCard 
                project={project} 
                onClick={() => {
                  setSelectedProject(project);
                  setCurrentImageIndex(0);
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default ProjectsSection;