import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  Box, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from "@mui/material";

const InterestDialog = ({
  showInterestDialog,
  setShowInterestDialog,
  formData,
  setFormData,
  errors,
  handleSubmitInterest,
  jobTypes,
  handleJobTypesChange
}) => {
  return (
    <Dialog
      open={showInterestDialog}
      onClose={() => setShowInterestDialog(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Express Interest</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmitInterest}>
          <Box mb={2}>
            <TextField
              label="Phone Number"
              fullWidth
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Address"
              fullWidth
              multiline
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              error={!!errors.address}
              helperText={errors.address}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Expected Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.expectedDate}
              onChange={(e) => setFormData({...formData, expectedDate: e.target.value})}
              error={!!errors.expectedDate}
              helperText={errors.expectedDate}
            />
          </Box>
          <Box mb={2}>
            <FormControl fullWidth error={!!errors.jobTypes}>
              <InputLabel>Job Types</InputLabel>
              <Select
                multiple
                value={formData.jobTypes}
                onChange={handleJobTypesChange}
                renderValue={(selected) => selected.join(', ')}
              >
                {jobTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.jobTypes && (
                <Typography variant="caption" color="error">
                  {errors.jobTypes}
                </Typography>
              )}
            </FormControl>
          </Box>
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button variant="outlined" onClick={() => setShowInterestDialog(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InterestDialog;