import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Typography, 
  Button,
  Box
} from "@mui/material";
import { ChevronLeft, ChevronRight, X, Trash2 } from "lucide-react";

const ProjectViewDialog = ({
  selectedProject,
  currentImageIndex,
  setSelectedProject,
  setCurrentImageIndex,
  nextImage,
  prevImage,
  handleTouchStart,
  handleTouchMove,
  isOwnerView,
  openDeleteConfirmation
}) => {
  return (
    <Dialog
      open={!!selectedProject}
      onClose={() => {
        setSelectedProject(null);
        setCurrentImageIndex(0);
      }}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: 'black',
          color: 'white'
        }
      }}
    >
      <DialogTitle sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 1 }}>
        <div className="flex justify-between items-center">
          <span>Project {currentImageIndex + 1} of {selectedProject?.media?.length}</span>
          <IconButton 
            onClick={() => {
              setSelectedProject(null);
              setCurrentImageIndex(0);
            }}
            color="inherit"
          >
            <X />
          </IconButton>
        </div>
      </DialogTitle>
      
      <DialogContent 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          p: 0
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Left Arrow */}
        {selectedProject?.media?.length > 1 && (
          <IconButton
            onClick={prevImage}
            sx={{
              position: 'fixed',
              left: 16,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              zIndex: 1
            }}
            size="large"
          >
            <ChevronLeft />
          </IconButton>
        )}

        {/* Media Content */}
        <div className="w-full h-full flex items-center justify-center">
          {selectedProject?.media[currentImageIndex]?.type === 'video' ? (
            <video
              src={selectedProject.media[currentImageIndex].url}
              className="max-w-full max-h-full"
              controls
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={selectedProject?.media[currentImageIndex]?.url}
              alt={`Project media ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              loading="eager"
            />
          )}
        </div>

        {/* Right Arrow */}
        {selectedProject?.media?.length > 1 && (
          <IconButton
            onClick={nextImage}
            sx={{
              position: 'fixed',
              right: 16,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              zIndex: 1
            }}
            size="large"
          >
            <ChevronRight />
          </IconButton>
        )}

        {/* Dot Indicators */}
        {selectedProject?.media?.length > 1 && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 16,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              zIndex: 1
            }}
          >
            {selectedProject.media.map((_, index) => (
              <Box
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                sx={{
                  width: index === currentImageIndex ? 24 : 8,
                  height: 8,
                  bgcolor: index === currentImageIndex ? 'primary.main' : 'grey.500',
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>
        )}
      </DialogContent>

      {/* Project Info */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'background.paper',
          color: 'text.primary',
          p: 2,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          zIndex: 1
        }}
      >
        <Typography variant="body1" textAlign="center">
          {selectedProject?.description}
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
          Added on: {new Date(selectedProject?.createdAt).toLocaleDateString()}
        </Typography>

        {/* Delete Button */}
        {isOwnerView && (
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              onClick={() => openDeleteConfirmation(selectedProject._id)}
              color="error"
              startIcon={<Trash2 size={18} />}
            >
              Delete Project
            </Button>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default ProjectViewDialog;