import { 
  Avatar, 
  Box, 
  Button, 
  Chip, 
  IconButton, 
  Typography, 
  TextField,
  Rating,
  Tooltip
} from "@mui/material";
import { Camera, Edit, Save } from "lucide-react";
import { useState, useEffect } from "react";

const StoreHeader = ({ 
  storeData, 
  isOwnerView, 
  onProfileImageChange, 
  profileImagePreview,
  onSaveProfileImage,
  profileImage,
  description: propDescription,
  onDescriptionUpdate
}) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [localDescription, setLocalDescription] = useState(propDescription);

  // Sync local description when prop changes
  useEffect(() => {
    setLocalDescription(propDescription);
  }, [propDescription]);

  const handleDescriptionSave = () => {
    onDescriptionUpdate(localDescription);
    setIsEditingDescription(false);
  };

  return (
    <Box className="w-full md:w-1/3 flex flex-col items-center">
      <Box className="relative mb-4">
        <Avatar
          sx={{ width: 150, height: 150 }}
          className="rounded-xl border-4 border-gray-100 shadow-sm"
          src={profileImagePreview || storeData.profilePicture}
        />
        {isOwnerView && (
          <>
            <label className="absolute bottom-2 right-2 bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-700 transition-all">
              <Camera className="w-5 h-5 text-white" />
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={onProfileImageChange}
              />
            </label>
            {profileImage && (
              <Button
                variant="contained"
                size="small"
                onClick={onSaveProfileImage}
                className="mt-2"
                color="dark"
              >
                Save 
              </Button>
            )}
          </>
        )}
      </Box>
      
      <Typography variant="h5" className="font-bold text-center">
        {storeData.storeName}
      </Typography>
      <Typography variant="subtitle1" className="text-gray-600 text-center">
        {storeData.ownerName}
      </Typography>
      
      <Chip 
        label={storeData.storeType} 
        color="primary" 
        className="mt-3 capitalize px-3 py-1"
        sx={{ fontWeight: 500, borderRadius: 1 }}
      />

      {/* Rating Display - Only shown for customer view */}
       
        <Box className="flex flex-col items-center mt-3">
          {storeData.averageRating > 0 ? (
            <>
              <Tooltip title={`Average rating: ${storeData.averageRating.toFixed(1)}`}>
                <Box className="flex items-center">
                  <Rating 
                    value={storeData.averageRating} 
                    precision={0.1} 
                    readOnly 
                    size="medium"
                  />
                  <Typography variant="body1" className="ml-2 font-medium">
                    {storeData.averageRating.toFixed(1)}
                  </Typography>
                </Box>
              </Tooltip>
              <Typography variant="body2" className="text-gray-600 mt-1">
                ({storeData.totalReviews} review{storeData.totalReviews !== 1 ? 's' : ''})
              </Typography>
            </>
          ) : (
            <Typography variant="body2" className="text-gray-500">
              No ratings yet
            </Typography>
          )}
        </Box>
      
      
      <DescriptionSection 
        isOwnerView={isOwnerView}
        isEditing={isEditingDescription}
        description={localDescription}
        onDescriptionChange={setLocalDescription}
        onEditToggle={() => setIsEditingDescription(!isEditingDescription)}
        onSave={handleDescriptionSave}
      />
    </Box>
  );
};

const DescriptionSection = ({
  isOwnerView,
  isEditing,
  description,
  onDescriptionChange,
  onEditToggle,
  onSave
}) => {
  return (
    <Box className="w-full mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 relative">
      {isOwnerView && !isEditing ? (
        <IconButton
          onClick={onEditToggle}
          className="absolute top-2 right-2"
          size="small"
        >
          <Edit size={16} />
        </IconButton>
      ) : null}
      
      {isEditing ? (
        <EditDescriptionForm 
          description={description}
          onDescriptionChange={onDescriptionChange}
          onCancel={() => {
            onEditToggle();
            // Reset to the current prop value (handled by parent's useEffect)
          }}
          onSave={onSave}
        />
      ) : (
        <Typography variant="body1" className="text-gray-700">
          {description || "No description available"}
        </Typography>
      )}
    </Box>
  );
};

const EditDescriptionForm = ({ description, onDescriptionChange, onCancel, onSave }) => {
  return (
    <Box>
      <TextField
        multiline
        fullWidth
        rows={4}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        variant="outlined"
        placeholder="Enter store description..."
      />
      <Box className="flex justify-end gap-2 mt-2">
        <Button
          variant="outlined"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          startIcon={<Save size={16} />}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default StoreHeader;