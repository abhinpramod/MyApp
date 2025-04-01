// components/store/StoreDetails.jsx
import { Box, Typography } from "@mui/material";

const StoreDetails = ({ storeData }) => {
  return (
    <Box className="w-full md:w-2/3 space-y-4">
      <Typography variant="h6" className="font-semibold pb-2 border-b">
        Store Information
      </Typography>
      
      <Box className="space-y-3">
        <DetailItem label="Email" value={storeData.email} />
        <DetailItem label="Phone" value={storeData.phone} />
        <DetailItem label="GST Number" value={storeData.gstNumber} />
        <DetailItem 
          label="Address" 
          value={`${storeData.address}, ${storeData.city}, ${storeData.state}, ${storeData.country}`}
        />
      </Box>
    </Box>
  );
};

const DetailItem = ({ label, value }) => (
  <Box>
    <Typography variant="subtitle2" className="font-medium text-gray-500">
      {label}
    </Typography>
    <Typography variant="body1" className="text-gray-800">
      {value || 'N/A'}
    </Typography>
  </Box>
);

export default StoreDetails;