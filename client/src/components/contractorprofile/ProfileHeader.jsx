import { Avatar, Typography, TextField, Button, Box } from "@mui/material";
import { Camera } from "lucide-react";

const ProfileHeader = ({
  profilePic,
  companyName,
  contractorName,
  isOwnerView,
  handleProfilePicUpload,
  description,
  isEditingDescription,
  tempDescription,
  setTempDescription,
  handleSaveDescription,
  setIsEditingDescription
}) => {
  return (
    <div className="w-full md:w-1/3 flex flex-col items-center">
      <div className="relative">
        <Avatar
          sx={{ width: 120, height: 120 }}
          className="border-4 border-gray-200"
          src={profilePic || "/avatar.png"}
        />
        {isOwnerView && (
          <label className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-700 transition-colors">
            <Camera className="w-5 h-5 text-white" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleProfilePicUpload}
            />
          </label>
        )}
      </div>
      
      <h2 className="text-xl font-bold mt-4 text-center">{companyName}</h2>
      <h4 className="text-gray-600 text-center">{contractorName}</h4>

      {/* Description */}
      <div className="w-full mt-4">
        {isOwnerView && isEditingDescription ? (
          <div className="space-y-2">
            <TextField
              multiline
              rows={4}
              fullWidth
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              variant="outlined"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outlined" onClick={() => setIsEditingDescription(false)}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSaveDescription}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div 
            onClick={isOwnerView ? () => setIsEditingDescription(true) : undefined}
            className={`p-4 rounded-lg ${
              description 
                ? "border border-gray-200 bg-white" 
                : "border-2 border-dashed border-gray-300 bg-gray-50"
            } ${isOwnerView ? "cursor-pointer hover:border-blue-300" : ""}`}
          >
            <p className={description ? "text-gray-700" : "text-gray-500 italic"}>
              {description || (isOwnerView ? "Click to add description..." : "No description")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;