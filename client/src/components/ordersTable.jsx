// components/OrdersTable.jsx
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import { ViewIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const OrdersTable = ({ orders, viewOrderDetails, isMobile, navigate }) => {
  return (
    <Paper elevation={3} sx={{ 
      p: isMobile ? 1 : 3, 
      mb: 4,
      borderRadius: 3,
      overflow: 'hidden'
    }}>
      <TableContainer>
        <Table>
          <TableHead style={{ background: 'linear-gradient(to bottom, #f5f5f5, #ffffff)' }}>
            <TableRow sx={{ bgcolor: 'white' }}>
              <TableCell>Order ID</TableCell>
              {!isMobile && (
                <>
                  <TableCell>Date</TableCell>
                  <TableCell>Store</TableCell>
                </>
              )}
              <TableCell>Items</TableCell>
              <TableCell>Transport</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map(order => (
                <OrderTableRow 
                  key={order._id} 
                  order={order} 
                  isMobile={isMobile} 
                  viewOrderDetails={viewOrderDetails}
                />
              ))
            ) : (
              <NoOrdersRow isMobile={isMobile} navigate={navigate} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const OrderTableRow = ({ order, isMobile, viewOrderDetails }) => {
  return (
    <TableRow hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
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
  );
};

const NoOrdersRow = ({ isMobile, navigate }) => {
  return (
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
  );
};

export default OrdersTable;