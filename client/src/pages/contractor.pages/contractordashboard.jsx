import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Home, Settings, User } from 'lucide-react';

const Dashboard = () => {
  return (
    <Grid container mt={3} spacing={3}>
      {/* Card 1 */}
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
            Total interests: 10
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This is the home card. It provides an overview of your home-related activities.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card 2 */}
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            
            <Typography variant="h5" component="div" gutterBottom>
              Total projects: 5
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This is the settings card. Manage your preferences and configurations here.
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card 3 */}
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            
            <Typography variant="h5" component="div" gutterBottom>
              Groth
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This is the profile card. View and edit your personal information here.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard;