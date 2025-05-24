import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Badge,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  CircularProgress 
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  XCircle as CancelIcon,
  Truck as ShippingIcon,
  CreditCard as PaymentIcon,
  Store as StoreIcon,
  Home as HomeIcon,
  ShoppingBasket as BasketIcon,
  Eye as ViewIcon,
  Trash2 as RejectIcon,
  Check as ConfirmIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../lib/axios';

// Custom theme for stylish UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#4a148c',
    },
    secondary: {
      main: '#ff6f00',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
  },
});

const OrderConfirmationPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/orders/pending-confirmation', {
     });
      setOrders(response.data.orders||[]);
    } catch (error) {
      toast.error('Failed to fetch orders');
      // Fallback to mock data in case of error (for demo purposes)
    
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const confirmOrder = async (orderId) => {
    try {
      await axios.post('/api/orders/confirm', 
        { orderIds: [orderId] 
      });
      toast.success('Order confirmed successfully');
      setOrders(orders.filter(order => order._id !== orderId));
      setIsDetailOpen(false);
    } catch (error) {
      toast.error('Failed to confirm order');
    }
  };

  const rejectOrder = async () => {
    if (!rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await axiosInstance.patch(
        `/orders/${selectedOrder._id}/reject`,
        { rejectionReason }
      );
      toast.success('Order rejected successfully');
      setOrders(orders.filter(order => order._id !== selectedOrder._id));
      setIsDetailOpen(false);
      setSelectedOrder(null);
      setRejectionReason('');
    } catch (error) {
      toast.error('Failed to reject order');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
        <Box sx={{ 
          mt: 10,
          p: isMobile ? 2 : 4, 
          maxWidth: 1400, 
          mx: 'auto',
          background: 'linear-gradient(to bottom, #f5f5f5, #ffffff)',
          minHeight: '100vh'
        }}>
          {/* Header */}
          <Box sx={{ 
            mb: 4, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              fontSize: isMobile ? '1.8rem' : '2.4rem'
            }}>
              Orders with Transportation Charges
            </Typography>
            
            <Badge 
              badgeContent={orders.length} 
              color="secondary" 
              sx={{ 
                '& .MuiBadge-badge': { 
                  fontSize: '1rem', 
                  height: 28, 
                  minWidth: 28,
                  borderRadius: '50%'
                } 
              }}
            >
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Pending Orders
              </Typography>
            </Badge>
          </Box>

          {/* Main Content */}
          <Paper elevation={3} sx={{ 
            p: isMobile ? 1 : 3, 
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden'
          }}>
            {/* Orders Table */}
            <TableContainer>
              <Table>
                <TableHead style={{ background: 'linear-gradient(to bottom, #f5f5f5, #ffffff)' }}>
                  <TableRow sx={{ bgcolor: 'white' }}>
                    <TableCell sx={{ color: '' }}>Order ID</TableCell>
                    {!isMobile && (
                      <>
                        <TableCell sx={{ color: '' }}>Date</TableCell>
                        <TableCell sx={{ color: '' }}>Store</TableCell>
                      </>
                    )}
                    <TableCell sx={{ color: '' }}>Items</TableCell>
                    <TableCell sx={{ color: '' }}>Transport</TableCell>
                    <TableCell sx={{ color: '' }}>Total</TableCell>
                    <TableCell sx={{ color: '' }}>Status</TableCell>
                    <TableCell sx={{ color: '' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <TableRow key={order._id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            #{order._id.substring(18, 24).toUpperCase()}
                          </Typography>
                        </TableCell>
                        {!isMobile && (
                          <>
                            <TableCell>
                              {format(new Date(order.createdAt), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontWeight: 'medium' }}>
                                {order.storeDetails.storeName}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {order.storeDetails.city}, {order.storeDetails.state}
                              </Typography>
                            </TableCell>
                          </>
                        )}
                        <TableCell>
                          <Chip 
                            label={`${order.items.reduce((sum, item) => sum + item.quantity, 0)} items`}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 'medium', color: 'secondary.main' }}>
                            ₹{order.transportationCharge}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 'bold' }}>
                            ₹{order.totalAmount}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status.toUpperCase()}
                            color="warning"
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => viewOrderDetails(order)}
                            color="primary"
                            sx={{ 
                              bgcolor: 'primary.light',
                              '&:hover': { bgcolor: 'primary.main', color: 'white' }
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isMobile ? 5 : 7} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="textSecondary">
                          No orders with transportation charges found
                        </Typography>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          sx={{ mt: 2 }}
                          onClick={() => navigate('/dashboard')}
                        >
                          Go to Dashboard
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Order Details Dialog */}
          <Dialog
            open={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            fullWidth
            maxWidth="md"
            fullScreen={isMobile}
          >
            <DialogTitle sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box>
                Order #{selectedOrder?._id.substring(18, 24).toUpperCase()}
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {selectedOrder && format(new Date(selectedOrder.createdAt), 'PPPp')}
                </Typography>
              </Box>
              <IconButton 
                onClick={() => setIsDetailOpen(false)} 
                sx={{ color: 'white' }}
              >
                <CancelIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: isMobile ? 1 : 3 }}>
              {selectedOrder && (
                <Box>
                  {/* Order Summary */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 3,
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 1
                  }}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                      <Chip
                        label={selectedOrder.status.toUpperCase()}
                        color="warning"
                        icon={<CheckCircleIcon />}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Payment</Typography>
                      <Chip
                        label={selectedOrder.paymentStatus.toUpperCase()}
                        color={selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'}
                        icon={<PaymentIcon />}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Method</Typography>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {selectedOrder.paymentMethod.toUpperCase()}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Transport</Typography>
                      <Typography sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                        ₹{selectedOrder.transportationCharge}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">Total</Typography>
                      <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        ₹{selectedOrder.totalAmount}
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    {/* Store Details */}
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <StoreIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">Store Details</Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 'medium' }}>
                          {selectedOrder.storeDetails.storeName}
                        </Typography>
                        <Typography color="textSecondary">
                          {selectedOrder.storeDetails.city}, {selectedOrder.storeDetails.state}
                        </Typography>
                        {selectedOrder.storeDetails.profilePicture && (
                          <Avatar 
                            src={selectedOrder.storeDetails.profilePicture} 
                            sx={{ width: 80, height: 80, mt: 2 }}
                          />
                        )}
                      </Paper>
                    </Grid>

                    {/* Shipping Address */}
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <HomeIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">Shipping Address</Typography>
                        </Box>
                        <Typography>{selectedOrder.shippingInfo.address.buildingAddress}</Typography>
                        <Typography>
                          {selectedOrder.shippingInfo.address.city}, {selectedOrder.shippingInfo.address.state}
                        </Typography>
                        <Typography>
                          {selectedOrder.shippingInfo.address.country} - {selectedOrder.shippingInfo.address.pincode}
                        </Typography>
                        {selectedOrder.shippingInfo.address.landmark && (
                          <Typography color="textSecondary">
                            Landmark: {selectedOrder.shippingInfo.address.landmark}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Order Items */}
                  <Paper elevation={0} sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BasketIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Order Items</Typography>
                    </Box>
                    <TableContainer>
                      <Table size={isMobile ? 'small' : 'medium'}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            {!isMobile && <TableCell>Details</TableCell>}
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Qty</TableCell>
                            <TableCell align="right">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedOrder.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar 
                                    src={item.productDetails.image} 
                                    alt={item.productDetails.name}
                                    sx={{ width: 56, height: 56, mr: 2 }}
                                  />
                                  {isMobile && (
                                    <Box>
                                      <Typography sx={{ fontWeight: 'medium' }}>
                                        {item.productDetails.name}
                                      </Typography>
                                      <Typography variant="body2" color="textSecondary">
                                        ₹{item.price} × {item.quantity}
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                              </TableCell>
                              {!isMobile && (
                                <TableCell>
                                  <Typography variant="body2" color="textSecondary">
                                    {item.productDetails.weightPerUnit} {item.productDetails.unit} per piece
                                  </Typography>
                                </TableCell>
                              )}
                              <TableCell align="right">
                                <Typography>₹{item.price}</Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography>{item.quantity}</Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography sx={{ fontWeight: 'medium' }}>
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Order Totals */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end',
                      mt: 3
                    }}>
                      <Box sx={{ width: isMobile ? '100%' : '50%' }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          mb: 1,
                          p: 1
                        }}>
                          <Typography>Subtotal:</Typography>
                          <Typography>₹{selectedOrder.subtotal}</Typography>
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          mb: 1,
                          p: 1,
                          bgcolor: 'secondary.light',
                          borderRadius: 1
                        }}>
                          <Typography sx={{ fontWeight: 'bold' }}>Transportation:</Typography>
                          <Typography sx={{ fontWeight: 'bold' }}>
                            ₹{selectedOrder.transportationCharge}
                          </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          p: 1,
                          bgcolor: 'primary.light',
                          borderRadius: 1
                        }}>
                          <Typography sx={{ fontWeight: 'bold' }}>Total:</Typography>
                          <Typography sx={{ fontWeight: 'bold' }}>
                            ₹{selectedOrder.totalAmount}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Rejection Section */}
                  <Paper elevation={0} sx={{ 
                    mt: 3, 
                    p: 3, 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'error.light',
                    bgcolor: 'error.light'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CancelIcon color="error" sx={{ mr: 1 }} />
                      <Typography variant="h6" color="error">
                        Reject Order
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Reason for rejection"
                      placeholder="Please provide detailed reason for rejecting this order..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                  </Paper>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              p: 2,
              bgcolor: 'background.default'
            }}>
              <Button
                onClick={() => confirmOrder(selectedOrder._id)}
                color="primary"
                variant="contained"
                startIcon={<ConfirmIcon />}
                sx={{
                  borderRadius: 5,
                  px: 3,
                  fontWeight: 'bold'
                }}
              >
                Confirm Order
              </Button>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  onClick={() => setIsDetailOpen(false)}
                  variant="outlined"
                  sx={{ borderRadius: 5 }}
                >
                  Close
                </Button>
                <Button
                  onClick={rejectOrder}
                  color="error"
                  variant="contained"
                  disabled={!rejectionReason}
                  startIcon={<RejectIcon />}
                  sx={{
                    borderRadius: 5,
                    px: 3,
                    fontWeight: 'bold'
                  }}
                >
                  Reject Order
                </Button>
              </Box>
            </DialogActions>
          </Dialog>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default OrderConfirmationPage;