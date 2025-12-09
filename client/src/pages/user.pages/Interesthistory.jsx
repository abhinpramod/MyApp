import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Paper,
  Typography,
  Tooltip,
  useMediaQuery,
  useTheme,
  Grid,
  IconButton, 
} from "@mui/material";
import { LucideCheckCircle, LucideClock, ArrowLeft } from "lucide-react"; 
import axiosInstance from "../../lib/axios";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom"; // Imported for navigation

const InterestSentHistory = () => {
  const [interestHistory, setInterestHistory] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle the back navigation
  const handleGoBack = () => {
    navigate(-1); // Navigates to the previous page in the history stack
  };

  useEffect(() => {
    const fetchInterestHistory = async () => {
      try {
        const response = await axiosInstance.get("/user/all-interests");
        setInterestHistory(response.data || []);
      } catch (error) {
        // You might want to add a toast/alert here for better UX
        console.error("Failed to fetch interest history:", error);
      }
    };

    fetchInterestHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusIcon = (status) => {
    switch (status) {
      case true:
        return (
          <Tooltip title="Seen by Contractor" placement="top">
            <LucideCheckCircle className="text-green-500 w-5 h-5" />
          </Tooltip>
        );
      case false:
        return (
          <Tooltip title="Pending Review" placement="top">
            <LucideClock className="text-yellow-500 w-5 h-5" />
          </Tooltip>
        );
      default:
        return null;
    }
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 mt-16 to-gray-100"
      >
        <div className="max-w-5xl mx-auto">
          {/* Header Row with Back Button and Title */}
          <div className="flex items-center justify-start mb-8 relative">
            <IconButton 
              onClick={handleGoBack} 
              className="text-gray-700 hover:text-blue-600 transition-colors mr-4 absolute left-0 top-1/2 -translate-y-1/2"
              aria-label="go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </IconButton>
            <Typography
              variant={isSmallScreen ? "h5" : "h3"}
              className="font-bold w-full text-center text-gray-800"
              style={{ padding: isSmallScreen ? '0 40px' : 0 }} // Add padding to avoid overlap on small screens
            >
              Interest Sent History 📬
            </Typography>
          </div>
          {/* End Header Row */}
          
          <Card
            component={Paper}
            elevation={5}
            className="shadow-xl w-full rounded-xl overflow-hidden border border-gray-200"
          >
            <CardContent>
              {interestHistory.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Typography variant="h6" className="font-semibold mb-2">
                    No Interests Sent
                  </Typography>
                  <Typography variant="body1">
                    You haven't sent any interest requests yet.
                  </Typography>
                </div>
              ) : isSmallScreen ? (
                // Card-based layout for small screens
                <Grid container spacing={2}>
                  {interestHistory.map((interest) => (
                    <Grid item xs={12} key={interest._id}>
                      <Card className="p-4 border border-gray-100 shadow-sm">
                        <Typography variant="subtitle1" className="font-bold text-blue-600 mb-1">
                          {interest.companyName}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          <span className="font-medium">Email:</span> {interest.contractorEmail}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          <span className="font-medium">Address:</span> {truncateText(interest.address, 30)}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          <span className="font-medium">Job Types:</span> {truncateText(interest.jobTypes.join(", "), 30)}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          <span className="font-medium">Date:</span> {interest.expectedDate}
                        </Typography>
                        <div className="flex items-center gap-2 mt-2">
                          {statusIcon(interest.seenByContractor)}
                          <Badge
                            sx={{ '& .MuiBadge-badge': { height: 20, minWidth: 60, fontSize: '0.75rem', fontWeight: 600, padding: '0 8px' } }}
                            color={interest.seenByContractor ? "success" : "warning"}
                          >
                            {interest.seenByContractor ? "Seen" : "Pending"}
                          </Badge>
                        </div>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                // Table layout for larger screens
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow className="bg-blue-50">
                        <TableCell className="font-bold text-blue-800">
                          Company Name
                        </TableCell>
                        <TableCell className="font-bold text-blue-800">
                          Email
                        </TableCell>
                        <TableCell className="font-bold text-blue-800">
                          Address
                        </TableCell>
                        <TableCell className="font-bold text-blue-800">
                          Job Types
                        </TableCell>
                        <TableCell className="font-bold text-blue-800">
                          Expected Date
                        </TableCell>
                        <TableCell className="font-bold text-blue-800 text-center">
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {interestHistory.map((interest) => (
                        <motion.tr
                          key={interest._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-blue-50/50"
                        >
                          <TableCell className="font-medium text-gray-800">
                            {interest.companyName}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {interest.contractorEmail}
                          </TableCell>
                          <TableCell className="text-gray-600 max-w-xs truncate">
                            <Tooltip title={interest.address} placement="top">
                              {truncateText(interest.address, 20)}
                            </Tooltip>
                          </TableCell>
                          <TableCell className="text-gray-600 max-w-xs truncate">
                            <Tooltip
                              title={interest.jobTypes.join(", ")}
                              placement="top"
                            >
                              {truncateText(interest.jobTypes.join(", "), 30)}
                            </Tooltip>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {interest.expectedDate}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              {statusIcon(interest.seenByContractor)}
                              <Badge
                                sx={{ '& .MuiBadge-badge': { height: 20, minWidth: 60, fontSize: '0.75rem', fontWeight: 600, padding: '0 8px' } }}
                                color={interest.seenByContractor ? "success" : "warning"}
                              >
                                {interest.seenByContractor ? "Seen" : "Pending"}
                              </Badge>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </>
  );
};

export default InterestSentHistory;