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
  CircularProgress
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

  const confirmOrder = async (orderId) => {
    try {
      await axios.post('/api/orders/confirm', { orderIds: [orderId] });
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
            confirmOrder={confirmOrder}
            rejectOrder={rejectOrder}
          />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default OrderConfirmationPage;