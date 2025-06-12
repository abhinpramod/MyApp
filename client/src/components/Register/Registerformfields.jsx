// components/Register/Registerformfields.js
import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { Country, State, City } from "country-state-city";

const FormFields = ({
  form,
  errors,
  handleChange,
  handleJobTypesChange,
  jobTypes,
  states,
  cities,
  handleCountryChange,
  handleStateChange,
  handleCityChange,
}) => {
  return (
    <>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold", fontSize: "1.5rem" }}
      >
        Register as Contractor
      </Typography>
      
      {/* Text Input Fields */}
      {["companyName", "contractorName", "email", "phone", "numberOfEmployees"].map((field) => (
        <Box key={field} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
            name={field}
            value={form[field]}
            onChange={handleChange}
            label={field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
            variant="outlined"
            error={!!errors[field]}
            helperText={errors[field]}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Box>
      ))}

      {/* Job Types Select */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="jobTypes-label">Job Types</InputLabel>
        <Select
          labelId="jobTypes-label"
          name="jobTypes"
          value={form.jobTypes}
          onChange={handleJobTypesChange}
          multiple
          fullWidth
          variant="outlined"
          error={!!errors.jobTypes}
          sx={{
            borderRadius: "8px",
          }}
          renderValue={(selected) => selected.join(", ")}
        >
          {jobTypes.map((option) => (
            <MenuItem key={option._id || option} value={option.name || option}>
              {option.name || option}
            </MenuItem>
          ))}
        </Select>
        {errors.jobTypes && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
            {errors.jobTypes}
          </Typography>
        )}
      </FormControl>

      {/* Password Fields */}
      {["password", "confirmPassword"].map((field) => (
        <Box key={field} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            type="password"
            name={field}
            value={form[field]}
            onChange={handleChange}
            label={field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
            variant="outlined"
            error={!!errors[field]}
            helperText={errors[field]}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Box>
      ))}

      {/* Location Fields */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="country-label">Country</InputLabel>
          <Select
            labelId="country-label"
            name="country"
            value={form.country.code}
            onChange={handleCountryChange}
            fullWidth
            variant="outlined"
            error={!!errors.country}
            sx={{ borderRadius: "8px" }}
          >
            {Country.getAllCountries().map((country) => (
              <MenuItem key={country.isoCode} value={country.isoCode}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
          {errors.country && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors.country}
            </Typography>
          )}
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="state-label">State</InputLabel>
          <Select
            labelId="state-label"
            name="state"
            value={form.state.code}
            onChange={handleStateChange}
            disabled={!form.country.code}
            fullWidth
            variant="outlined"
            error={!!errors.state}
            sx={{ borderRadius: "8px" }}
          >
            {states.map((state) => (
              <MenuItem key={state.isoCode} value={state.isoCode}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
          {errors.state && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors.state}
            </Typography>
          )}
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="city-label">City</InputLabel>
          <Select
            labelId="city-label"
            name="city"
            value={form.city}
            onChange={handleCityChange}
            disabled={!form.state.code}
            fullWidth
            variant="outlined"
            error={!!errors.city}
            sx={{ borderRadius: "8px" }}
          >
            {cities.map((city) => (
              <MenuItem key={city.name} value={city.name}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
          {errors.city && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors.city}
            </Typography>
          )}
        </FormControl>
      </Box>
    </>
  );
};

export default FormFields; 