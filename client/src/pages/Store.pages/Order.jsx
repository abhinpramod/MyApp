import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import {
  FiFilter,
  FiSearch,
  FiX,
  FiTruck,
  FiDollarSign,
  FiAlertCircle,
  FiCheckCircle,
  FiPackage,
} from "react-icons/fi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Divider,
  Grid,
  Badge,
  Pagination,
  Stack,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    paymentMethod: "",
    search: "",
  });
  const [filterType, setFilterType] = useState(""); // 'new', 'rejected', 'to-be-delivered', 'out-for-delivery', 'delivered' or ''
  const [sort, setSort] = useState({ field: "createdAt", order: "desc" });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transportationCharge, setTransportationCharge] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [toBeDeliveredCount, setToBeDeliveredCount] = useState(0);
  const [outForDeliveryCount, setOutForDeliveryCount] = useState(0);

  // Confirmation dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmDialogTitle, setConfirmDialogTitle] = useState("");
  const [confirmDialogContent, setConfirmDialogContent] = useState("");
  const [confirmButtonText, setConfirmButtonText] = useState("");
  const [confirmButtonColor, setConfirmButtonColor] = useState("primary");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...(filterType && { filterType }),
          ...(!filterType && filters.status && { status: filters.status }),
          ...(!filterType && filters.paymentStatus && {
            paymentStatus: filters.paymentStatus,
          }),
          ...(!filterType && filters.paymentMethod && {
            paymentMethod: filters.paymentMethod,
          }),
          ...(filters.search && { search: filters.search }),
          sortBy: sort.field,
          sortOrder: sort.order,
        };

        const response = await axiosInstance.get("/orders", { params });
        setOrders(response.data.orders);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total,
          pages: response.data.pages,
        }));
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    const fetchNotificationCounts = async () => {
      try {
        const [newOrders, toBeDelivered, outForDelivery] = await Promise.all([
          axiosInstance.get("/orders/notifications"),
          axiosInstance.get("/orders/to-be-delivered"),
          // axiosInstance.get("/orders/out-for-delivery"),
        ]);
        setNewOrderCount(newOrders.data);
        setToBeDeliveredCount(toBeDelivered.data);
        setOutForDeliveryCount(outForDelivery.data);
      } catch (error) {
        console.error("Error fetching notification counts:", error);
      }
    };

    fetchOrders();
    fetchNotificationCounts();
  }, [pagination.page, pagination.limit, filters, sort, filterType]);

  const openConfirmDialog = (
    action,
    title,
    content,
    buttonText,
    buttonColor = "primary"
  ) => {
    setConfirmAction(() => action);
    setConfirmDialogTitle(title);
    setConfirmDialogContent(content);
    setConfirmButtonText(buttonText);
    setConfirmButtonColor(buttonColor);
    setConfirmDialogOpen(true);
  };

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setConfirmAction(null);
  };

  const executeConfirmedAction = () => {
    if (confirmAction) {
      confirmAction();
    }
    closeConfirmDialog();
  };

  const handleFilterType = (type) => {
    setFilterType(filterType === type ? "" : type);
    setFilters(prev => ({ ...prev, status: "", paymentStatus: "", paymentMethod: "" }));
  };

  const handleStatusFilter = (status) => {
    setFilterType("");
    setFilters((prev) => ({ ...prev, status }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePaymentStatusFilter = (paymentStatus) => {
    setFilterType("");
    setFilters((prev) => ({ ...prev, paymentStatus }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePaymentMethodFilter = (paymentMethod) => {
    setFilterType("");
    setFilters((prev) => ({ ...prev, paymentMethod }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      order:
        prev.field === field ? (prev.order === "asc" ? "desc" : "asc") : "desc",
    }));
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setTransportationCharge(order.transportationCharge || 0);
    setRejectionReason(order.rejectionReason || "");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
    setRejectionReason("");
  };

  const handleTransportationChargeChange = (e) => {
    setTransportationCharge(e.target.value);
  };

  const updateTransportationCharge = async () => {
    if (!selectedOrder) return;

    try {
      setIsUpdating(true);
      await axiosInstance.patch(`/orders/${selectedOrder._id}/transportation`, {
        transportationCharge: Number(transportationCharge),
      });
      toast.success("Transportation charge updated successfully");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === selectedOrder._id
            ? {
                ...order,
                transportationCharge: Number(transportationCharge),
                totalAmount: order.subtotal + Number(transportationCharge),
              }
            : order
        )
      );

      closeDialog();
    } catch (error) {
      console.error("Error updating transportation charge:", error);
      toast.error("Failed to update transportation charge");
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmUpdate = () => {
    openConfirmDialog(
      updateTransportationCharge,
      "Update Transportation Charge",
      "Are you sure you want to update the transportation charge for this order?",
      "Update",
      "primary"
    );
  };

  const rejectOrder = async () => {
    if (!selectedOrder || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setIsRejecting(true);
      await axiosInstance.patch(`/orders/${selectedOrder._id}/reject`, {
        rejectionReason: rejectionReason.trim(),
      });
      toast.success("Order rejected successfully");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === selectedOrder._id
            ? {
                ...order,
                status: "cancelled",
                rejectionReason: rejectionReason.trim(),
                paymentStatus:
                  order.paymentStatus === "paid"
                    ? "refunded"
                    : order.paymentStatus,
              }
            : order
        )
      );

      closeDialog();
    } catch (error) {
      console.error("Error rejecting order:", error);
      toast.error("Failed to reject order");
    } finally {
      setIsRejecting(false);
    }
  };

  const confirmRejection = () => {
    openConfirmDialog(
      rejectOrder,
      "Reject Order",
      "Are you sure you want to reject this order? This action cannot be undone.",
      "Reject",
      "error"
    );
  };

  const updateDeliveryStatus = async (status) => {
    if (!selectedOrder) return;

    try {
      setIsUpdating(true);
      await axiosInstance.patch(`/orders/${selectedOrder._id}/delivery-status`, {
        status,
      });
      toast.success(`Order marked as ${status}`);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === selectedOrder._id
            ? {
                ...order,
                deleverystatus: status,
                status: status === "delivered" ? "delivered" : order.status,
              }
            : order
        )
      );

      closeDialog();
    } catch (error) {
      console.error(`Error updating delivery status to ${status}:`, error);
      toast.error(`Failed to update delivery status`);
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDeliveryStatusUpdate = (status) => {
    const statusText = status === "out-for-delivery" 
      ? "Out for Delivery" 
      : status.charAt(0).toUpperCase() + status.slice(1);
      
    openConfirmDialog(
      () => updateDeliveryStatus(status),
      `Mark as ${statusText}`,
      `Are you sure you want to mark this order as ${statusText}?`,
      `Mark as ${statusText}`,
      status === "delivered" ? "success" : "primary"
    );
  };

  const getStatusBadge = (order) => {
    // Check for new orders (pending and transportationCharge = 0)
    if (order.status === 'pending' && order.transportationCharge === 0) {
      return (
        <Chip
          label="New Order"
          color="warning"
          size="small"
          icon={<FiAlertCircle size={14} />}
        />
      );
    }
    
    // Check for rejected orders
    if (order.status === 'cancelled' && order.rejectionReason) {
      return (
        <Chip
          label="Rejected"
          color="error"
          size="small"
          icon={<FiX size={14} />}
        />
      );
    }

    // Check delivery status
    if (order.deleverystatus === 'out-for-delivery') {
      return (
        <Chip
          label="Out for Delivery"
          color="info"
          size="small"
          icon={<FiTruck size={14} />}
        />
      );
    }

    if (order.deleverystatus === 'pending') {
      return (
        <Chip
          label="To Be Delivere"
          color="info"
          size="small"
          icon={<FiPackage size={14} />}
        />
      );
    }

    if (order.deleverystatus === 'delivered') {
      return (
        <Chip
          label="Delivered"
          color="success"
          size="small"
          icon={<FiCheckCircle size={14} />}
        />
      );
    }

    // Regular status badges
    const statusColors = {
      pending: "warning",
      processing: "info",
      shipped: "primary",
      delivered: "success",
      cancelled: "error",
    };
    
    return (
      <Chip
        label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        color={statusColors[order.status] || "default"}
        size="small"
      />
    );
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const paymentColors = {
      pending: "warning",
      paid: "success",
      failed: "error",
      refunded: "secondary",
    };
    return (
      <Chip
        label={paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
        color={paymentColors[paymentStatus] || "default"}
        size="small"
      />
    );
  };

  const getPaymentMethodBadge = (paymentMethod) => {
    const methodColors = {
      cod: "warning",
      online: "success",
      wallet: "info",
    };
    return (
      <Chip
        label={paymentMethod === 'cod' ? 'COD' : paymentMethod?.charAt(0).toUpperCase() + paymentMethod?.slice(1)}
        color={methodColors[paymentMethod] || "default"}
        size="small"
      />
    );
  };

  const handlePageChange = (event, value) => {
    setPagination((prev) => ({ ...prev, page: value }));
  };

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "100%", mx: "auto" }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { md: "center" },
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", mb: { xs: 2, md: 0 } }}
          >
            Orders Management
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Search orders..."
            value={filters.search}
            onChange={handleSearch}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: "100%", md: 300 } }}
          />
        </Box>

        {/* Filters */}
        <Paper sx={{ mb: 4, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { sm: "center" },
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FiFilter style={{ marginRight: 8, color: "#6b7280" }} />
              <Typography variant="body2" color="textSecondary">
                Filter by:
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Badge badgeContent={newOrderCount} color="error">
                <Button
                  onClick={() => handleFilterType("new")}
                  variant={filterType === "new" ? "contained" : "outlined"}
                  size="small"
                  color={filterType === "new" ? "primary" : "inherit"}
                >
                  New Orders
                </Button>
              </Badge>
              
              <Button
                onClick={() => handleFilterType("rejected")}
                variant={filterType === "rejected" ? "contained" : "outlined"}
                size="small"
                color={filterType === "rejected" ? "error" : "inherit"}
              >
                Rejected Orders
              </Button>

              <Badge badgeContent={toBeDeliveredCount} color="error">
                <Button
                  onClick={() => handleFilterType("to-be-delivere")}
                  variant={filterType === "to-be-delivered" ? "contained" : "outlined"}
                  size="small"
                  color={filterType === "to-be-delivere" ? "info" : "inherit"}
                  startIcon={<FiPackage size={14} />}
                >
                  To Be Delivered

                </Button>
              </Badge>

              <Badge badgeContent={outForDeliveryCount} color="error">
                <Button
                  onClick={() => handleFilterType("out-for-delivery")}
                  variant={filterType === "out-for-delivery" ? "contained" : "outlined"}
                  size="small"
                  color={filterType === "out-for-delivery" ? "info" : "inherit"}
                  startIcon={<FiTruck size={14} />}
                >
                  Out for Delivery
                </Button>
              </Badge>

              <Button
                onClick={() => handleFilterType("delivered")}
                variant={filterType === "delivered" ? "contained" : "outlined"}
                size="small"
                color={filterType === "delivered" ? "success" : "inherit"}
                startIcon={<FiCheckCircle size={14} />}
              >
                Delivered
              </Button>

              <Button
                onClick={() => setFilterType("")}
                variant={filterType === "" ? "contained" : "outlined"}
                size="small"
                color={filterType === "" ? "primary" : "inherit"}
              >
                All Orders
              </Button>
            </Box>
          </Box>

          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mr: 1, alignSelf: 'center' }}>
              Status:
            </Typography>
            {["", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
              <Button
                key={status || "all"}
                onClick={() => handleStatusFilter(status)}
                variant={filters.status === status ? "contained" : "outlined"}
                size="small"
                color={filters.status === status ? "primary" : "inherit"}
                disabled={!!filterType}
              >
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : "All Statuses"}
              </Button>
            ))}
          </Box>

          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mr: 1, alignSelf: 'center' }}>
              Payment:
            </Typography>
            {["", "pending", "paid", "failed", "refunded"].map((paymentStatus) => (
              <Button
                key={paymentStatus || "all"}
                onClick={() => handlePaymentStatusFilter(paymentStatus)}
                variant={filters.paymentStatus === paymentStatus ? "contained" : "outlined"}
                size="small"
                color={filters.paymentStatus === paymentStatus ? "primary" : "inherit"}
                disabled={!!filterType}
              >
                {paymentStatus ? paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1) : "All Payments"}
              </Button>
            ))}
          </Box>

          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mr: 1, alignSelf: 'center' }}>
              Method:
            </Typography>
            {["", "cod", "online", "wallet"].map((paymentMethod) => (
              <Button
                key={paymentMethod || "all"}
                onClick={() => handlePaymentMethodFilter(paymentMethod)}
                variant={filters.paymentMethod === paymentMethod ? "contained" : "outlined"}
                size="small"
                color={filters.paymentMethod === paymentMethod ? "primary" : "inherit"}
                disabled={!!filterType}
              >
                {paymentMethod ? 
                  (paymentMethod === 'cod' ? 'COD' : paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)) 
                  : "All Methods"}
              </Button>
            ))}
          </Box>
        </Paper>

        {/* Orders Table */}
        <Paper sx={{ overflow: "hidden" }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 8,
              }}
            >
              <CircularProgress />
            </Box>
          ) : orders.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography color="textSecondary">No orders found</Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        onClick={() => handleSort("_id")}
                        sx={{ cursor: "pointer", fontWeight: "bold" }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Order ID
                          {sort.field === "_id" && (
                            <span style={{ marginLeft: 4 }}>
                              {sort.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("createdAt")}
                        sx={{ cursor: "pointer", fontWeight: "bold" }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Date
                          {sort.field === "createdAt" && (
                            <span style={{ marginLeft: 4 }}>
                              {sort.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Customer
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Items</TableCell>
                      <TableCell
                        onClick={() => handleSort("totalAmount")}
                        sx={{ cursor: "pointer", fontWeight: "bold" }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Total
                          {sort.field === "totalAmount" && (
                            <span style={{ marginLeft: 4 }}>
                              {sort.order === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Payment</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Method</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id} hover>
                        <TableCell>
                          #{order._id.substring(18, 24).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(order.createdAt),
                            "MMM d, yyyy HH:mm"
                          )}
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {order.userDetails?.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {order.userDetails?.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}{" "}
                          items
                        </TableCell>
                        <TableCell fontWeight="medium">
                          ₹{order.totalAmount}
                        </TableCell>
                        <TableCell>{getStatusBadge(order)}</TableCell>
                        <TableCell>
                          {getPaymentStatusBadge(order.paymentStatus)}
                        </TableCell>
                        <TableCell>
                          {getPaymentMethodBadge(order.paymentMethod)}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            onClick={() => openOrderDetails(order)}
                            color="primary"
                            size="small"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="textSecondary">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} results
                </Typography>
                <Pagination
                  count={pagination.pages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            </>
          )}
        </Paper>
      </Box>

      {/* Order Details Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            Order Details - #
            {selectedOrder?._id.substring(18, 24).toUpperCase()}
          </Typography>
          <IconButton onClick={closeDialog}>
            <FiX />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box>
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Customer Information
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {selectedOrder.userDetails?.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {selectedOrder.userDetails?.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      {selectedOrder.shippingInfo?.address?.buildingAddress}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {selectedOrder.shippingInfo?.address?.city},{" "}
                      {selectedOrder.shippingInfo?.address?.state}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {selectedOrder.shippingInfo?.address?.country} -{" "}
                      {selectedOrder.shippingInfo?.address?.pincode}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      Phone: {selectedOrder.shippingInfo?.phoneNumber}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Order Summary
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={1}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Order Date:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {format(
                            new Date(selectedOrder.createdAt),
                            "MMM d, yyyy HH:mm"
                          )}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Status:
                        </Typography>
                        {getStatusBadge(selectedOrder)}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Payment Status:
                        </Typography>
                        {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Payment Method:
                        </Typography>
                        {getPaymentMethodBadge(selectedOrder.paymentMethod)}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Subtotal:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          ₹{selectedOrder.subtotal}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Shipping:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          ₹{selectedOrder.transportationCharge || 0}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          Total Amount:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          ₹{selectedOrder.totalAmount}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                Order Items
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              src={item.productDetails?.image}
                              alt={item.productDetails?.name}
                              sx={{ width: 40, height: 40, mr: 2 }}
                            />
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {item.productDetails?.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {item.productDetails?.weightPerUnit}{" "}
                                {item.productDetails?.unit} per piece
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">₹{item.price}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Delivery Actions */}
              {selectedOrder.status !== "cancelled" && (
                <Box sx={{ mt: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Delivery Actions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {selectedOrder.deleverystatus !== 'out-for-delivery' && selectedOrder.deleverystatus !== 'delivered' && (
                      <Button
                        variant="contained"
                        color="info"
                        startIcon={<FiTruck />}
                        onClick={() => confirmDeliveryStatusUpdate('out-for-delivery')}
                        disabled={isUpdating}
                      >
                        Mark as Out for Delivery
                      </Button>
                    )}
                    {selectedOrder.deleverystatus !== 'delivered' && (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<FiCheckCircle />}
                        onClick={() => confirmDeliveryStatusUpdate('delivered')}
                        disabled={isUpdating}
                      >
                        Mark as Delivered
                      </Button>
                    )}
                  </Box>
                </Box>
              )}

              {/* Rejection Section */}
              {selectedOrder.status !== "cancelled" && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    border: 1,
                    borderColor: "error.light",
                    borderRadius: 1,
                    backgroundColor: "background.paper",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <FiAlertCircle
                      style={{ marginRight: 8, color: "error.main" }}
                    />
                    <Typography variant="subtitle2" color="error">
                      Reject Order
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Reason for Rejection"
                    placeholder="Provide the reason for rejecting this order..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      onClick={closeDialog}
                      variant="outlined"
                      color="inherit"
                      sx={{ mr: 1 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmRejection}
                      disabled={isRejecting || !rejectionReason.trim()}
                      variant="contained"
                      color="error"
                    >
                      {isRejecting ? "Rejecting..." : "Reject Order"}
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Show rejection reason if order is already cancelled */}
              {selectedOrder.status === "cancelled" &&
                selectedOrder.rejectionReason && (
                  <Paper
                    variant="outlined"
                    sx={{
                      mt: 3,
                      p: 2,
                      borderColor: "error.light",
                      bgcolor: "error.light",
                    }}
                  >
                    <Typography variant="subtitle2" color="error" gutterBottom>
                      Rejection Reason
                    </Typography>
                    <Typography variant="body2" color="error">
                      {selectedOrder.rejectionReason}
                    </Typography>
                  </Paper>
                )}

              {/* Transportation Charge Section */}
              {selectedOrder.status === "pending" && selectedOrder.transportationCharge === 0 && (
                <Paper variant="outlined" sx={{ mt: 3, p: 2 }}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Update Transportation Charge
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Transportation Charge (₹)"
                      type="number"
                      value={transportationCharge}
                      onChange={handleTransportationChargeChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FiDollarSign />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ maxWidth: 300 }}
                    />
                    <Button
                      onClick={confirmUpdate}
                      disabled={isUpdating}
                      variant="contained"
                      startIcon={<FiTruck />}
                    >
                      {isUpdating ? "Updating..." : "Update Charge"}
                    </Button>
                  </Box>
                </Paper>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={closeConfirmDialog}
        style={{ zIndex: 9999 }}
      >
        <DialogTitle>{confirmDialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialogContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={executeConfirmedAction}
            color={confirmButtonColor}
            variant="contained"
          >
            {confirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders;