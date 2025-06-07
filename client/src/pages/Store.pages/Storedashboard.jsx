import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Avatar, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  Stack
} from '@mui/material';
import { 
  ShoppingBag as OrdersIcon,
  DollarSign as RevenueIcon,
  CreditCard as OnlinePaymentIcon,
  Wallet as CodIcon,
  CheckCircle as DeliveredIcon,
  Truck as OutForDeliveryIcon,
  Clock as PendingDeliveryIcon,
  User as CustomerIcon,
  ArrowUp as GrowthIcon,
  Package as ProductsIcon
} from 'lucide-react';
import axiosInstance from '../../lib/axios';

const StoreDashboard = ({ storeId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/orders");
        setOrders(response.data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [storeId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  // Calculate payment method metrics
  const onlinePayments = orders.filter(order => order.paymentMethod === 'online');
  const codPayments = orders.filter(order => order.paymentMethod === 'cod');
  
  const totalOnlineAmount = onlinePayments.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalCodAmount = codPayments.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalRevenue = totalOnlineAmount + totalCodAmount;

  // Other metrics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

  // Delivery status metrics
  const deliveredCount = orders.filter(o => o.deleverystatus === 'delivered').length;
  const outForDeliveryCount = orders.filter(o => o.deleverystatus === 'out-for-delivery').length;
  const pendingDeliveryCount = orders.filter(o => o.deleverystatus === 'pending').length;
  const deliverySuccessRate = totalOrders > 0 ? ((deliveredCount / totalOrders) * 100).toFixed(1) : 0;

  // Get recent orders for the table
  const recentOrders = orders.slice(0, 5);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Store Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        {/* Total Orders */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <OrdersIcon size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h6">Total Orders</Typography>
                  <Typography variant="h4">{totalOrders}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Revenue */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <RevenueIcon size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h6">Total Revenue</Typography>
                  <Typography variant="h4">₹{totalRevenue.toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Online Payments */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <OnlinePaymentIcon size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h6">Online Payments</Typography>
                  <Typography variant="h4">₹{totalOnlineAmount.toLocaleString()}</Typography>
                  <Typography variant="caption">
                    {onlinePayments.length} order{onlinePayments.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* COD Payments */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <CodIcon size={24} />
                </Avatar>
                <Box>
                  <Typography variant="h6">COD Payments</Typography>
                  <Typography variant="h4">₹{totalCodAmount.toLocaleString()}</Typography>
                  <Typography variant="caption">
                    {codPayments.length} order{codPayments.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Method Breakdown */}
      <Typography variant="h5" gutterBottom mt={4}>
        Payment Method Breakdown
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Distribution
              </Typography>
              <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                <Box textAlign="center" p={2} width="50%">
                  <OnlinePaymentIcon size={32} color="#1976d2" />
                  <Typography variant="h6" mt={1}>
                    {onlinePayments.length} ({totalOrders > 0 ? Math.round((onlinePayments.length / totalOrders) * 100) : 0}%)
                  </Typography>
                  <Typography variant="body2">Online Payments</Typography>
                  <Typography variant="subtitle1">
                    ₹{totalOnlineAmount.toLocaleString()}
                  </Typography>
                </Box>
                <Box textAlign="center" p={2} width="50%">
                  <CodIcon size={32} color="#ed6c02" />
                  <Typography variant="h6" mt={1}>
                    {codPayments.length} ({totalOrders > 0 ? Math.round((codPayments.length / totalOrders) * 100) : 0}%)
                  </Typography>
                  <Typography variant="body2">Cash on Delivery</Typography>
                  <Typography variant="subtitle1">
                    ₹{totalCodAmount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Status
              </Typography>
              <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                {[
                  { status: 'delivered', icon: <DeliveredIcon size={24} color="#2e7d32" />, label: 'Delivered', color: 'success.main' },
                  { status: 'out-for-delivery', icon: <OutForDeliveryIcon size={24} color="#0288d1" />, label: 'Out for Delivery', color: 'info.main' },
                  { status: 'pending', icon: <PendingDeliveryIcon size={24} color="#ed6c02" />, label: 'Pending', color: 'warning.main' },
                ].map((item) => {
                  const count = orders.filter(o => o.deleverystatus === item.status).length;
                  const amount = orders
                    .filter(o => o.deleverystatus === item.status)
                    .reduce((sum, order) => sum + order.totalAmount, 0);
                  
                  return (
                    <Box key={item.status} textAlign="center" p={1} width="33%">
                      <Avatar sx={{ bgcolor: item.color, mb: 1, mx: 'auto' }}>
                        {item.icon}
                      </Avatar>
                      <Typography variant="h6">{count}</Typography>
                      <Typography variant="body2">{item.label}</Typography>
                      <Typography variant="subtitle2">
                        ₹{amount.toLocaleString()}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders Table */}
      <Typography variant="h5" gutterBottom mt={4}>
        Recent Orders
      </Typography>
      
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>#{order._id.substring(18, 24)}</TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                      <CustomerIcon size={16} />
                    </Avatar>
                    {order.userDetails?.name || 'Unknown'}
                  </Box>
                </TableCell>
                <TableCell>
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.paymentMethod === 'online' ? 'Online' : 'COD'} 
                    color={order.paymentMethod === 'online' ? 'primary' : 'secondary'}
                    size="small"
                    icon={order.paymentMethod === 'online' ? 
                      <OnlinePaymentIcon size={14} /> : 
                      <CodIcon size={14} />}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.deleverystatus} 
                    color={
                      order.deleverystatus === 'delivered' ? 'success' : 
                      order.deleverystatus === 'out-for-delivery' ? 'info' : 
                      'warning'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">₹{order.totalAmount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StoreDashboard;