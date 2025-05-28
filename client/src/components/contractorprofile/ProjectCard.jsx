import { Card, CardContent, Typography } from "@mui/material";

const ProjectCard = ({ project, onClick }) => (
  <Card 
    onClick={onClick}
    sx={{ 
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3
      }
    }}
  >
    <div className="relative h-48">
      {project.media[0] && project.media[0].type === 'video' ? (
        <video
          src={project.media[0].url}
          className="w-full h-full object-cover"
          muted
          loop
          autoPlay
        />
      ) : (
        <img
          src={project.media[0]?.url}
          alt="Project thumbnail"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
      {project.media?.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
          +{project.media.length - 1}
        </div>
      )}
    </div>
    <CardContent>
      <Typography 
        variant="body2" 
        className="line-clamp-2"
        title={project.description}
      >
        {project.description}
      </Typography>
    </CardContent>
  </Card>
);

export default ProjectCard;