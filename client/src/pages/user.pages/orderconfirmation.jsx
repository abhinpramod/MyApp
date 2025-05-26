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
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
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
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
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

// Stripe payment form component
const StripePaymentForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent on backend
      const response = await axiosInstance.post('/api/payment/create-payment-intent', {
        amount: amount * 100 // Convert to cents
      });

      const { clientSecret } = response.data;

      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <CardElement 
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{ borderRadius: 5 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || processing}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 5, px: 3 }}
        >
          {processing ? 'Processing...' : `Pay ₹${amount}`}
        </Button>
      </Box>
    </Box>
  );
};

const OrderConfirmationPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingOrders();
    // Load Stripe
    const initializeStripe = async () => {
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
      setStripePromise(stripe);
    };
    initializeStripe();
  }, []);

  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/orders/pending-confirmation');
      setOrders(response.data.orders||[]);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
    setPaymentMethod('cod'); // Reset to COD when opening dialog
    setShowStripeForm(false); // Hide stripe form
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setShowStripeForm(event.target.value === 'online');
  };

  const confirmOrder = async () => {
    if (paymentMethod === 'online' && !showStripeForm) {
      toast.error('Please complete the payment first');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/orders/confirm', {
        orderId: selectedOrder._id,
        paymentMethod,
        ...(paymentMethod === 'online' && { paymentStatus: 'paid' })
      });
      
      toast.success('Order confirmed successfully');
      setOrders(orders.filter(order => order._id !== selectedOrder._id));
      setIsDetailOpen(false);
    } catch (error) {
      toast.error('Failed to confirm order');
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    toast.success(`Payment successful! (ID: ${paymentIntent.id})`);
    // Payment is successful, now confirm the order
    confirmOrder();
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
          {/* Header and main table remain the same as your original code */}
          {/* ... */}
          
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
                  {/* Order Summary and other details remain the same */}
                  {/* ... */}

                  {/* Payment Method Selection */}
                  <Paper elevation={0} sx={{ 
                    mt: 3, 
                    p: 3, 
                    borderRadius: 2,
                    bgcolor: 'background.paper'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PaymentIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Payment Method</Typography>
                    </Box>
                    
                    <FormControl component="fieldset">
                      <RadioGroup
                        aria-label="payment method"
                        name="paymentMethod"
                        value={paymentMethod}
                        onChange={handlePaymentMethodChange}
                      >
                        <FormControlLabel 
                          value="cod" 
                          control={<Radio />} 
                          label="Cash on Delivery (COD)" 
                        />
                        <FormControlLabel 
                          value="online" 
                          control={<Radio />} 
                          label="Online Payment" 
                        />
                      </RadioGroup>
                    </FormControl>

                    {showStripeForm && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                          Pay ₹{selectedOrder.totalAmount} securely with Stripe
                        </Typography>
                        {stripePromise && (
                          <Elements stripe={stripePromise}>
                            <StripePaymentForm 
                              amount={selectedOrder.totalAmount}
                              onSuccess={handlePaymentSuccess}
                              onCancel={() => setShowStripeForm(false)}
                            />
                          </Elements>
                        )}
                      </Box>
                    )}
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
                onClick={confirmOrder}
                color="primary"
                variant="contained"
                disabled={paymentMethod === 'online' && showStripeForm}
                startIcon={<ConfirmIcon />}
                sx={{
                  borderRadius: 5,
                  px: 3,
                  fontWeight: 'bold'
                }}
              >
                {paymentMethod === 'cod' ? 'Confirm Order' : 'Confirm After Payment'}
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