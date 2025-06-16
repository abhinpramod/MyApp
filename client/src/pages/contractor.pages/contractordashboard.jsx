// Dashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Home, Settings, User, ArrowUpDown } from 'lucide-react';
import axiosInstance from '../../lib/axios';

const Dashboard = () => {
  // const [stats, setStats] = useState(null);
  const [newInterests, setNewInterests] = useState(0);
  const [totalInterests, setTotalInterests] = useState(0);
  const [seenedInterests,setseenedInterests] = useState(0);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
      

        // Fetch recent interests
        const interestsResponse = await axiosInstance.get('/contractor/all-interests')

        // const interestsData = await interestsResponse;
        setInterests(interestsResponse.data);
        console.log(interestsResponse.da)
        setTotalInterests(interestsResponse.data.length)
        setNewInterests(interestsResponse.data.filter((interest) => interest.seenByContractor === false).length);
        setseenedInterests(interestsResponse.data.filter((interest) => interest.seenByContractor === true).length);
        

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={3}>
        Error loading dashboard: {error}
      </Typography>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Grid container spacing={3}>
        {/* Card 1 - Total Interests */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Home color="primary" style={{ marginRight: '10px' }} />
                <Typography variant="h5" component="div">
                  Total Interests
                </Typography>
              </Box>
            <center>  <Typography variant="h3" component="div">
                {totalInterests || 0}
              </Typography></center>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Number of interest submissions received
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2 - Total Projects */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Settings color="primary" style={{ marginRight: '10px' }} />
                <Typography variant="h5" component="div">
                  Pending Interests
                </Typography>
              </Box>
              <center>  <Typography variant="h3" component="div">
                { newInterests || 0}
              </Typography></center>
            
              <Typography variant="body2" color="text.secondary" mt={1}>
                Number of interests yet to be seen
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3 - Job Type Distribution */}
        <Grid item xs={12} sm={6} md={4}>
           <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Settings color="primary" style={{ marginRight: '10px' }} />
                <Typography variant="h5" component="div">
                  Number of Seen Interests</Typography>
              </Box>
              <center> <Typography variant="h3" component="div">
                { seenedInterests || 0}
              </Typography></center>
             
              <Typography variant="body2" color="text.secondary" mt={1}>
                Number of interests seen by contractors
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Interests Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Interests

              </Typography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Job Types</TableCell>
                      <TableCell>Expected Date</TableCell>
                      <TableCell>Contractor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {interests.slice(0, 5).map((interest) => (
                      <TableRow key={interest._id}>
                        <TableCell>{interest.name}</TableCell>
                        <TableCell>{interest.email}</TableCell>
                        <TableCell>{interest.phoneNumber}</TableCell>
                        <TableCell>{interest.jobTypes.join(', ')}</TableCell>
                        <TableCell>{interest.expectedDate}</TableCell>
                        <TableCell>{interest.contractorName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;