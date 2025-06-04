// components/OrderDetailsDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  TextField,
  Button,
  IconButton 
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  XCircle as CancelIcon,
  CreditCard as PaymentIcon,
  Store as StoreIcon,
  Home as HomeIcon,
  ShoppingBasket as BasketIcon,
  Trash2 as RejectIcon,
  Check as ConfirmIcon
} from 'lucide-react';
import { format } from 'date-fns';

const OrderDetailsDialog = ({
  isDetailOpen,
  setIsDetailOpen,
  selectedOrder,
  isMobile,
  rejectionReason,
  setRejectionReason,
  confirmOrder,  // This now triggers payment method selection
  rejectOrder
}) => {
  return (
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
            <OrderSummary selectedOrder={selectedOrder} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <StoreDetails selectedOrder={selectedOrder} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ShippingAddress selectedOrder={selectedOrder} />
              </Grid>
            </Grid>

            <OrderItems selectedOrder={selectedOrder} isMobile={isMobile} />
            
            {selectedOrder.status === 'pending' && (
              <RejectionSection 
                rejectionReason={rejectionReason}
                setRejectionReason={setRejectionReason}
              />
            )}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        p: 2,
        bgcolor: 'background.default'
      }}>
        {selectedOrder?.status === 'pending' ? (
          <>
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
          </>
        ) : (
          <Button
            onClick={() => setIsDetailOpen(false)}
            variant="contained"
            sx={{ borderRadius: 5 }}
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const OrderSummary = ({ selectedOrder }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'success';
      case 'rejected': return 'error';
      case 'out-for-delivery': return 'info';
      case 'delivered': return 'secondary';
      default: return 'warning';
    }
  };

  return (
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
          color={getStatusColor(selectedOrder.status)}
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
          {selectedOrder.paymentMethod?.toUpperCase()}
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
  );
};

const StoreDetails = ({ selectedOrder }) => (
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
);

const ShippingAddress = ({ selectedOrder }) => (
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
);

const OrderItems = ({ selectedOrder, isMobile }) => (
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
            <OrderItemRow key={index} item={item} isMobile={isMobile} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <OrderTotals selectedOrder={selectedOrder} isMobile={isMobile} />
  </Paper>
);

const OrderItemRow = ({ item, isMobile }) => (
  <TableRow>
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
);

const OrderTotals = ({ selectedOrder, isMobile }) => (
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
);

const RejectionSection = ({ rejectionReason, setRejectionReason }) => (
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
);

export default OrderDetailsDialog;