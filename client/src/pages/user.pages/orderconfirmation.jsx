// OrderConfirmationPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import axiosInstance from "../../lib/axios";
import Navbar from "../../components/Navbar";
import OrderDetailsDialog from "../../components/orderDeatailsDailog";
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
  FormLabel,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Badge,
  IconButton,
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import {
  CheckCircle as CheckCircle,
  Truck as LocalShipping,
  ClipboardCheck as AssignmentTurnedIn,
  CreditCard as Payment,
  Store as Store,
  Home as Home,
  ShoppingCart as ShoppingBasket,
  Info as Info,
  ArrowRight as ArrowForward,
  AlertTriangle as Warning,
  Check as Check,
    X as cancel,
} from "lucide-react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4a148c",
    },
    secondary: {
      main: "#ff6f00",
    },
    warning: {
      main: "#ff9800",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", sans-serif',
  },
});

// Utility functions moved outside the component
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "confirmed":
      return "info";
    case "processing":
      return "secondary";
    case "shipped":
      return "primary";
    case "delivered":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "pending":
      return <Warning />;
    case "confirmed":
      return <AssignmentTurnedIn />;
    case "processing":
      return <LocalShipping />;
    case "shipped":
      return <LocalShipping />;
    case "delivered":
      return <CheckCircle />;
    case "cancelled":
      return <Cancel />;
    default:
      return <Info />;
  }
};

const OrderConfirmationPage = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethodDialogOpen, setPaymentMethodDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
  const [orderToConfirm, setOrderToConfirm] = useState(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/orders/user-orders");
      setAllOrders(response.data.orders || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Orders that need confirmation
  const pendingConfirmationOrders = allOrders.filter(
    (order) => order.status === "pending" && order.deleverychargeadded
  );

  // Other orders
  const otherOrders = allOrders.filter(
    (order) => !(order.status === "pending" && order.deleverychargeadded)
  );

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handlePaymentMethodSelection = (orderId) => {
    const order = allOrders.find((o) => o._id === orderId);
    if (!order) return toast.error("Order not found");

    setOrderToConfirm(order);
    setPaymentMethodDialogOpen(true);
  };

  const handlePaymentMethodClose = () => {
    setPaymentMethodDialogOpen(false);
    setSelectedPaymentMethod("cod");
    setOrderToConfirm(null);
  };

  const confirmOrder = async () => {
    if (!orderToConfirm) return;

    setPaymentMethodDialogOpen(false);

    if (selectedPaymentMethod === "online") {
      try {
        const res = await axiosInstance.post(
          "/payments/create-checkout-session",
          {
            orderId: orderToConfirm._id,
          }
        );

        const newWindow = window.open(res.data.url, "_blank");

        if (
          !newWindow ||
          newWindow.closed ||
          typeof newWindow.closed === "undefined"
        ) {
          window.location.href = res.data.url;
        }

        const checkPaymentStatus = setInterval(async () => {
          try {
            const response = await axiosInstance.get(
              `/orders/${orderToConfirm._id}`
            );
            if (response.data.order.paymentStatus === "paid") {
              clearInterval(checkPaymentStatus);
              toast.success("Payment successful!");
              setAllOrders(
                allOrders.filter((order) => order._id !== orderToConfirm._id)
              );
              setIsDetailOpen(false);
              navigate("/payment-success", {
                state: { orderId: orderToConfirm._id },
              });
            }
          } catch (error) {
            console.error("Error checking payment status:", error);
          }
        }, 3000);
      } catch (error) {
        toast.error("Stripe checkout failed");
        console.error(error);
      }
    } else {
      try {
        await axiosInstance.post("/orders/confirm", {
          orderIds: [orderToConfirm._id],
        });
        toast.success("Order confirmed successfully");
        setAllOrders(
          allOrders.filter((order) => order._id !== orderToConfirm._id)
        );
        setIsDetailOpen(false);
      } catch (error) {
        toast.error("Failed to confirm order");
        console.error(error);
      }
    }

    setSelectedPaymentMethod("cod");
    setOrderToConfirm(null);
  };

  const rejectOrder = async () => {
    if (!rejectionReason) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await axiosInstance.patch(
        `/orders/${selectedOrder._id}/customer-reject`,
        { rejectionReason }
      );
      toast.success("Order rejected successfully");
      setAllOrders(
        allOrders.filter((order) => order._id !== selectedOrder._id)
      );
      setIsDetailOpen(false);
      setSelectedOrder(null);
      setRejectionReason("");
    } catch (error) {
      toast.error("Failed to reject order");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            mt: 10,
            p: isMobile ? 2 : 4,
            maxWidth: 1400,
            mx: "auto",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                fontSize: isMobile ? "1.8rem" : "2.4rem",
              }}
            >
              My Orders
            </Typography>

            <Badge
              badgeContent={pendingConfirmationOrders.length}
              color="warning"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "1rem",
                  height: 28,
                  minWidth: 28,
                  borderRadius: "50%",
                },
              }}
            >
              <Typography variant="subtitle1">Pending Confirmation</Typography>
            </Badge>
          </Box>

          {/* Orders Needing Confirmation - Highlighted Section */}
          {pendingConfirmationOrders.length > 0 && (
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "warning.main",
                }}
              >
                <Warning /> Orders Requiring Your Action
              </Typography>

              <Grid container spacing={3}>
                {pendingConfirmationOrders.map((order) => (
                  <Grid item xs={12} key={order._id}>
                    <OrderCard
                      order={order}
                      isMobile={isMobile}
                      viewOrderDetails={viewOrderDetails}
                      handlePaymentMethodSelection={
                        handlePaymentMethodSelection
                      }
                      highlight={true}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* All Other Orders */}
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {pendingConfirmationOrders.length > 0
                ? "Your Other Orders"
                : "All Orders"}
            </Typography>

            {otherOrders.length > 0 ? (
              <Grid container spacing={3}>
                {otherOrders.map((order) => (
                  <Grid item xs={12} sm={6} key={order._id}>
                    <OrderCard
                      order={order}
                      isMobile={isMobile}
                      viewOrderDetails={viewOrderDetails}
                      handlePaymentMethodSelection={
                        handlePaymentMethodSelection
                      }
                      highlight={false}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" color="textSecondary">
                  No orders found
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              </Paper>
            )}
          </Box>

          <OrderDetailsDialog
            isDetailOpen={isDetailOpen}
            setIsDetailOpen={setIsDetailOpen}
            selectedOrder={selectedOrder}
            isMobile={isMobile}
            rejectionReason={rejectionReason}
            setRejectionReason={setRejectionReason}
            confirmOrder={handlePaymentMethodSelection}
            rejectOrder={rejectOrder}
          />

          {/* Payment Method Selection Dialog */}
          <Dialog
            open={paymentMethodDialogOpen}
            onClose={handlePaymentMethodClose}
          >
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
              <Button
                onClick={confirmOrder}
                color="primary"
                variant="contained"
              >
                Continue
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </ThemeProvider>
    </>
  );
};

const OrderCard = ({
  order,
  isMobile,
  viewOrderDetails,
  handlePaymentMethodSelection,
  highlight,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        borderLeft: highlight ? "4px solid" : "none",
        borderColor: highlight ? "warning.main" : "transparent",
        position: "relative",
        overflow: "visible",
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-2px)",
          transition: "all 0.3s ease",
        },
      }}
    >
      {highlight && (
        <Box
          sx={{
            position: "absolute",
            top: -10,
            right: -10,
            bgcolor: "warning.main",
            color: "white",
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            fontSize: "0.75rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Warning fontSize="small" /> Action Required
        </Box>
      )}

      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Order #{order._id.substring(18, 24).toUpperCase()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {format(new Date(order.createdAt), "PPPp")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={order.status.toUpperCase()}
              color={getStatusColor(order.status)}
              icon={getStatusIcon(order.status)}
              size="small"
              sx={{ fontWeight: "bold" }}
            />
            <Chip
              label={`₹${order.totalAmount}`}
              color="primary"
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <Avatar
                src={order.storeDetails.profilePicture}
                sx={{ width: 60, height: 60 }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {order.storeDetails.storeName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {order.storeDetails.city}, {order.storeDetails.state}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                ITEMS SUMMARY
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {order.items.slice(0, 3).map((item, index) => (
                  <Chip
                    key={index}
                    avatar={<Avatar src={item.productDetails.image} />}
                    label={`${item.quantity}x ${item.productDetails.name}`}
                    variant="outlined"
                    size="small"
                  />
                ))}
                {order.items.length > 3 && (
                  <Chip
                    label={`+${order.items.length - 3} more`}
                    size="small"
                  />
                )}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                PAYMENT DETAILS
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">₹{order.subtotal}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Transport:</Typography>
                <Typography variant="body2" color="secondary.main">
                  ₹{order.transportationCharge}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Total:
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  ₹{order.totalAmount}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 3,
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Info />}
            onClick={() => viewOrderDetails(order)}
            sx={{ borderRadius: 5 }}
          >
            View Details
          </Button>
          {highlight && (
            <Button
              variant="contained"
              color="warning"
              endIcon={<ArrowForward />}
              onClick={() => handlePaymentMethodSelection(order._id)}
              sx={{ borderRadius: 5 }}
            >
              Confirm Now
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderConfirmationPage;