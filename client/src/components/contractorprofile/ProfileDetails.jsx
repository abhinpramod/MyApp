import { 
  TextField, 
  IconButton, 
  Box, 
  Typography,
  Button
} from "@mui/material";
import { Save, Pencil } from "lucide-react";
import Switch from "../../ui/switch";
import DetailItem from "./DetailItem";

const ProfileDetails = ({
  contractor,
  jobTypes,
  isOwnerView,
  availability,
  tempAvailability,
  setTempAvailability,
  setConfirmAvailabilityOpen,
  numberOfEmployees,
  isEditingEmployees,
  tempNumberOfEmployees,
  setTempNumberOfEmployees,
  setConfirmEmployeesOpen,
  setIsEditingEmployees,
  setShowInterestDialog
}) => {
  return (
    <div className="w-full md:w-2/3 space-y-4">
      <DetailItem label="Email" value={contractor.email} />
      <DetailItem label="GST" value={contractor.gstNumber} />
      {contractor.phone && <DetailItem label="Phone" value={contractor.phone} />}
      <DetailItem 
        label="Address" 
        value={`${contractor.address}, ${contractor.city}, ${contractor.state}, ${contractor.country}`} 
      />
      {jobTypes.length > 0 && (
        <DetailItem label="Job Types" value={jobTypes.join(", ")} />
      )}

      {/* Number of Employees */}
      <div className="flex items-center gap-2">
        <span className="font-medium">Number of Employees:</span>
        {isOwnerView && isEditingEmployees ? (
          <div className="flex items-center gap-2">
            <TextField
              type="number"
              value={tempNumberOfEmployees}
              onChange={(e) => setTempNumberOfEmployees(e.target.value)}
              size="small"
              sx={{ width: 80 }}
            />
            <IconButton onClick={() => setConfirmEmployeesOpen(true)}>
              <Save size={18} />
            </IconButton>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>{numberOfEmployees}</span>
            {isOwnerView && (
              <IconButton onClick={() => setIsEditingEmployees(true)} size="small">
                <Pencil size={16} />
              </IconButton>
            )}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="flex items-center gap-2">
        <span className="font-medium">Availability:</span>
        {isOwnerView ? (
          <>
            <Switch
              checked={availability}
              onChange={(e) => {
                setTempAvailability(e.target.checked);
                setConfirmAvailabilityOpen(true);
              }}
            />
            <span className={availability ? "text-green-600" : "text-red-600"}>
              {availability ? "Available" : "Not Available"}
            </span>
          </>
        ) : (
          <span className={contractor.availability ? "text-green-600" : "text-red-600"}>
            {contractor.availability ? "Available" : "Not Available"}
          </span>
        )}
      </div>

      {/* Interest Button */}
      {!isOwnerView && (
        <button
          onClick={() => setShowInterestDialog(true)}
          className={`bg-red-600 text-white px-4 py-2 rounded-md w-full md:w-auto ${
            contractor.availability ? "" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!contractor.availability}
        >
          Express Interest
        </button>
      )}
    </div>
  );
};

export default ProfileDetails;