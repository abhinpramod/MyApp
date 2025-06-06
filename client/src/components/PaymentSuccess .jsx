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
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    <Container 
      maxWidth="md" 
      sx={{ 
        mt: { xs: 4, sm: 8 },
        mb: 8,
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, sm: 4, md: 6 },
          textAlign: 'center',
          borderRadius: 2,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 3
          }}
        >
          <CheckCircle 
            sx={{ 
              fontSize: 80, 
              color: 'success.main',
              [theme.breakpoints.down('sm')]: {
                fontSize: 60
              }
            }} 
          />
        </Box>
        
        <Typography 
          variant={isMobile ? 'h5' : 'h4'} 
          gutterBottom
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 2
          }}
        >
          Payment Successful!
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            color: theme.palette.text.secondary,
            fontSize: isMobile ? '0.9rem' : '1rem',
            lineHeight: 1.6
          }}
        >
          Thank you for your payment. Your order <strong>#{orderId}</strong> has been confirmed and will be processed shortly.
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexDirection: isMobile ? 'column' : 'row'
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size={isMobile ? 'medium' : 'large'}
            onClick={() => navigate('/orders')}
            sx={{
              px: 4,
              py: isMobile ? 1 : 1.5,
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 1,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s'
              }
            }}
          >
            View Your Orders
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            size={isMobile ? 'medium' : 'large'}
            onClick={() => navigate('/stores')}
            sx={{
              px: 4,
              py: isMobile ? 1 : 1.5,
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 1,
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s'
              }
            }}
          >
            Continue Shopping
          </Button>
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 4,
            color: theme.palette.text.disabled,
            fontSize: '0.8rem'
          }}
        >
          A confirmation email has been sent to your registered email address.
        </Typography>
      </Paper>
    </Container>
  );
};

export default PaymentSuccess;