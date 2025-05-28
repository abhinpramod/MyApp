import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography,
  TextField,
  CircularProgress,
  Grid
} from "@mui/material";
import { CirclePlus } from "lucide-react";
import MediaPreview from "./MediaPreview";

const AddProjectDialog = ({
  openProjectDialog,
  setOpenProjectDialog,
  newProjectMedia,
  handleProjectMediaUpload,
  handleRemoveMedia,
  newProjectDescription,
  setNewProjectDescription,
  handleAddProject,
  uploadProgress,
  isOwnerView
}) => {
  return (
    <Dialog
      open={openProjectDialog}
      onClose={() => {
        setOpenProjectDialog(false);
        setNewProjectMedia([]);
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Add New Project</DialogTitle>
      <DialogContent>
        {uploadProgress > 0 && uploadProgress < 100 ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={4}>
            <CircularProgress variant="determinate" value={uploadProgress} size={60} />
            <Typography mt={2}>
              Uploading {uploadProgress}%
            </Typography>
          </Box>
        ) : (
          <>
            <Box mb={3}>
              <Typography variant="subtitle1" gutterBottom>
                Upload Media (1-3 files)
              </Typography>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition-colors">
                <Box textAlign="center" py={3}>
                  <CirclePlus className="mx-auto text-gray-400" size={32} />
                  <Typography variant="body2" color="textSecondary">
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Images or videos (max 20MB each)
                  </Typography>
                </Box>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleProjectMediaUpload}
                />
              </label>
            </Box>

            {newProjectMedia.length > 0 && (
              <Box mb={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Media ({newProjectMedia.length}/3)
                </Typography>
                <Grid container spacing={1}>
                  {newProjectMedia.map((media) => (
                    <Grid item xs={6} sm={4} key={media.id}>
                      <MediaPreview 
                        media={media} 
                        onRemove={handleRemoveMedia}
                        isOwnerView={isOwnerView}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <TextField
              label="Project Description"
              fullWidth
              multiline
              rows={3}
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              margin="normal"
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            setOpenProjectDialog(false);
            setNewProjectMedia([]);
          }}
          disabled={uploadProgress > 0}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAddProject}
          variant="contained"
          disabled={
            newProjectMedia.length === 0 || 
            !newProjectDescription ||
            uploadProgress > 0
          }
        >
          {uploadProgress > 0 ? 'Uploading...' : 'Add Project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProjectDialog;