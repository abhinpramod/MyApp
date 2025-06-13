import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip,
  Avatar,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { 
  ShoppingCart as CartIcon,
  Users as UsersIcon,
  Package as ProductIcon,
  DollarSign as PriceIcon,
  User as UserIcon
} from 'lucide-react';
import axiosInstance from '../../lib/axios';

const CartAnalyticsDashboard = ({ storeId }) => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axiosInstance.get("/cart/store");
        setCartData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // if (error) {
  //   return (
  //     <Box p={3}>
  //       <Typography color="error">Error: {error}</Typography>
  //     </Box>
  //   );
  // }

  // Calculate summary statistics
  const totalUsers = cartData.length;
  const totalProducts = cartData.reduce((acc, cart) => acc + cart.items.length, 0);
  const totalRevenue = cartData.reduce((acc, cart) => acc + cart.totalPrice, 0);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Cart Analytics
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <UsersIcon size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h6">Total Users</Typography>
                  <Typography variant="h4">{totalUsers}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <ProductIcon size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h6">Total Products</Typography>
                  <Typography variant="h4">{totalProducts}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <PriceIcon size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h6">Potential Revenue</Typography>
                  <Typography variant="h4">${totalRevenue.toFixed(2)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* User Cart Details */}
      <Typography variant="h5" gutterBottom mt={4}>
        User Cart Details
      </Typography>
      
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Products</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartData.map((cart) => (
              <React.Fragment key={cart._id}>
                <TableRow>
                  <TableCell rowSpan={cart.items.length + 1}>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                        <UserIcon size={20} />
                      </Avatar>
                      <Typography variant="body1">
                        {cart.userId?.name || 'Unknown User'}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                
                {cart.items.map((item) => (
                  <TableRow key={item.productId._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {item.productId?.image && (
                          <Avatar 
                            src={item.productId.image} 
                            alt={item.productId.name}
                            sx={{ width: 40, height: 40, mr: 2 }}
                          />
                        )}
                        <Typography>{item.productId?.name || 'Unknown Product'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={item.quantity} 
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">${item.basePrice.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      ${(item.basePrice * item.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="subtitle1">Cart Total:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle1">
                      ${cart.totalPrice.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CartAnalyticsDashboard;