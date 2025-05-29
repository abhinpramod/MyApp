// OrderConfirmationPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import axios from 'axios';
import axiosInstance from '../../lib/axios';
import Navbar from '../../components/Navbar';
import {
  Box,
  Typography,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import OrdersTable from '../../components/ordersTable';
import OrderDetailsDialog from '../../components/orderDeatailsDailog';
import PageHeader from '../../components/pageHeader';

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
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [orderToConfirm, setOrderToConfirm] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/orders/pending-confirmation');
      setOrders(response.data.orders || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handlePaymentMethodSelection = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return toast.error("Order not found");
    
    setOrderToConfirm(order);
    setPaymentMethodDialogOpen(true);
  };

  const handlePaymentMethodClose = () => {
    setPaymentMethodDialogOpen(false);
    setSelectedPaymentMethod('cod');
    setOrderToConfirm(null);
  };

// In the confirmOrder function of OrderConfirmationPage.jsx
const confirmOrder = async () => {
  if (!orderToConfirm) return;
  
  setPaymentMethodDialogOpen(false);
  
  if (selectedPaymentMethod === 'online') {
    try {
      const res = await axiosInstance.post('/payments/create-checkout-session', { 
        orderId: orderToConfirm._id 
      });
      
      // Open Stripe checkout in new tab
      const newWindow = window.open(res.data.url, '_blank');
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Fallback if popup is blocked
        window.location.href = res.data.url;
      }
      
      // Poll for payment completion
      const checkPaymentStatus = setInterval(async () => {
        try {
          const response = await axiosInstance.get(`/orders/${orderToConfirm._id}`);
          if (response.data.order.paymentStatus === 'paid') {
            clearInterval(checkPaymentStatus);
            toast.success('Payment successful!');
            setOrders(orders.filter(order => order._id !== orderToConfirm._id));
            setIsDetailOpen(false);
            navigate('/payment-success', { 
              state: { orderId: orderToConfirm._id } 
            });
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 3000);
      
    } catch (error) {
      toast.error('Stripe checkout failed');
      console.error(error);
    }
  } else {
    try {
      await axiosInstance.post('/orders/confirm', { 
        orderIds: [orderToConfirm._id] 
      });
      toast.success('Order confirmed successfully');
      setOrders(orders.filter(order => order._id !== orderToConfirm._id));
      setIsDetailOpen(false);
    } catch (error) {
      toast.error('Failed to confirm order');
      console.error(error);
    }
  }
  
  // Reset states
  setSelectedPaymentMethod('cod');
  setOrderToConfirm(null);
};

  const rejectOrder = async () => {
    if (!rejectionReason) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await axiosInstance.patch(
        `/orders/${selectedOrder._id}/customer-reject`,
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
          <PageHeader orders={orders} navigate={navigate} isMobile={isMobile} />
          
          <OrdersTable 
            orders={orders} 
            viewOrderDetails={viewOrderDetails} 
            isMobile={isMobile} 
            navigate={navigate}
          />

          <OrderDetailsDialog
            isDetailOpen={isDetailOpen}
            setIsDetailOpen={setIsDetailOpen}
            selectedOrder={selectedOrder}
            isMobile={isMobile}
            rejectionReason={rejectionReason}
            setRejectionReason={setRejectionReason}
            confirmOrder={handlePaymentMethodSelection} // Updated to show payment method dialog
            rejectOrder={rejectOrder}
          />

          {/* Payment Method Selection Dialog */}
          <Dialog open={paymentMethodDialogOpen} onClose={handlePaymentMethodClose}>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please choose how you would like to pay for this order.
              </DialogContentText>
              <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend">Payment Options</FormLabel>
                <RadioGroup
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                >
                  <FormControlLabel 
                    value="cod" 
                    control={<Radio />} 
                    label="Cash on Delivery (COD)" 
                  />
                  <FormControlLabel 
                    value="online" 
                    control={<Radio />} 
                    label="Pay Online (Credit/Debit Card)" 
                  />
                </RadioGroup>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handlePaymentMethodClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={confirmOrder} color="primary" variant="contained">
                Continue
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default OrderConfirmationPage;