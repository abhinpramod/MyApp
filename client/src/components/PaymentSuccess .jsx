// components/PaymentSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Container,
  Paper
} from '@mui/material';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        await axiosInstance.post('/payments/verify', { orderId });
        toast.success('Payment verified successfully!');
      } catch (error) {
        toast.error('Payment verification failed');
        console.error(error);
      }
    };

    if (orderId) {
      verifyPayment();
    }
  }, [orderId]);

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Payment Successful!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Thank you for your payment. Your order #{orderId} has been confirmed.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/orders')}
        >
          View Your Orders
        </Button>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;