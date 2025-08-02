import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/products/ProductCard";
import ProductDetailDialog from "../../components/products/ProductDetailDialog";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  X as CloseIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as CancelIcon,
  Filter as FilterIcon,
  ChevronDown as KeyboardArrowDown,
  ChevronUp as KeyboardArrowUp,
  Search as SearchIcon,
  MapPin,
  ShoppingCart,
} from "lucide-react";
import axiosInstance from "../../lib/axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-hot-toast";
import { Skeleton } from "../../components/ui/skeleton";
import qs from "qs";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [availability, setAvailability] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        const currentPage = reset ? 1 : page;
        const params = {
          search: searchQuery,
          priceRange,
          availability:
            availability === "available"
              ? true
              : availability === "unavailable"
                ? false
                : undefined,
          categories: selectedCategories,
          page: currentPage,
          limit: 8,
        };
        // Clean up undefined/empty params
        Object.keys(params).forEach((key) => {
          if (
            params[key] === undefined ||
            params[key] === "" ||
            (Array.isArray(params[key]) && params[key].length === 0)
          ) {
            delete params[key];
          }
        });
        const response = await axiosInstance.get("/products", {
          params,
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        });
        if (reset) {
          setProducts(response.data.products);
          setPage(2);
        } else {
          setProducts((prev) => [...prev, ...response.data.products]);
          setPage((prev) => prev + 1);
        }
        setTotal(response.data.total);
        setHasMore(response.data.hasMore);
        if (reset && response.data.products.length > 0) {
          const categories = [
            ...new Set(response.data.products.flatMap((p) => p.category)),
          ];
          setAllCategories(categories);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch products"
        );
        console.error("Fetch products error:", error);
      } finally {
        setLoading(false);
      }
    },
    [page, searchQuery, priceRange, availability, selectedCategories]
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => fetchProducts(true), 500);
    return () => clearTimeout(debounceTimer);
  }, [fetchProducts]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handlePriceRangeChange = (e) => {
    setPriceRange(e.target.value);
    setPage(1);
  };

  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.value);
    setPage(1);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setPage(1);
  };

  const handleAddToCart = async (cartItem) => {
    const { product, storeId, quantity } = cartItem;
    const productId = product._id;
    const productname = product.name;
    try {
      await axiosInstance.post("/cart/add-to-cart", {
        productId,
        storeId,
        quantity,
      });
      toast.success(`${quantity} ${productname} added to cart successfully`);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Failed to add product to cart", error);
      toast.error(error.response?.message || "Failed to add product to cart");
    }
  };

  const priceRanges = [
    { value: "", label: "All Prices" },
    { value: "0-500", label: "Under ₹500" },
    { value: "500-1000", label: "₹500 - ₹1000" },
    { value: "1000-5000", label: "₹1000 - ₹5000" },
    { value: "5000-10000", label: "₹5000 - ₹10000" },
    { value: "10000-Infinity", label: "Over ₹10000" },
  ];

  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <Card
          key={index}
          sx={{
            height: 320,
            borderRadius: 3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <Skeleton
            variant="rectangular"
            height={180}
            width="100%"
            animation="wave"
          />
          <CardContent>
            <Box sx={{ pt: 0.5 }}>
              <Skeleton width="60%" height={24} animation="wave" />
              <Skeleton width="40%" height={20} animation="wave" />
              <Skeleton width="30%" height={20} animation="wave" />
            </Box>
          </CardContent>
        </Card>
      ));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        backgroundImage: "linear-gradient(to bottom, #f8fafc, #f1f5f9)",
      }}
    >
      <Navbar />

      <Box
        sx={{
          maxWidth: "lg",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 4, md: 6 },
          mt:{xs:4,md:6}
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            mb: { xs: 4, md: 6 },
            textAlign: "center",
            position: "relative",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              mb: 2,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            Discover Our Products
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              maxWidth: "600px",
              mx: "auto",
              mb: 4,
              fontSize: "1rem",
            }}
          >
            Browse through our extensive collection of high-quality products
          </Typography>

          <Button
            onClick={() => navigate("/cart")}
            variant="contained"
            startIcon={<ShoppingCart size={18} />}
            sx={{
              position: { xs: "static", md: "absolute" },
              top: 0,
              right: 0,
              mt: { xs: 2, md: 0 },
              backgroundColor: "#3b82f6",
              color: "white",
              fontWeight: 600,
              borderRadius: 2,
              py: 1,
              px: 3,
              boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)",
              "&:hover": {
                backgroundColor: "#2563eb",
                boxShadow: "0 6px 8px rgba(59, 130, 246, 0.4)",
              },
            }}
          >
            Cart
          </Button>
        </Box>

        {/* Search and Filters Section */}
        <Box
          sx={{
            mb: { xs: 4, md: 5 },
            backgroundColor: "white",
            borderRadius: 3,
            p: 3,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products by name, category, store, or description..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="#94a3b8" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: "#f8fafc",
                py: 1.5,
                fontSize: "1rem",
              },
            }}
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Showing {products.length} of {total} products
            </Typography>

            <Button
              variant="outlined"
              startIcon={<FilterIcon size={18} />}
              endIcon={
                showFilters ? (
                  <KeyboardArrowUp size={18} />
                ) : (
                  <KeyboardArrowDown size={18} />
                )
              }
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 500,
                borderColor: "#cbd5e1",
                color: "#475569",
                "&:hover": {
                  borderColor: "#94a3b8",
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              Filters
            </Button>
          </Box>

          {showFilters && (
            <Card
              sx={{
                p: 3,
                mb: 3,
                bgcolor: "white",
                borderRadius: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid #e2e8f0",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                  gap: 3,
                }}
              >
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      fontWeight: 500,
                      color: "#64748b",
                    }}
                  >
                    Price Range
                  </InputLabel>
                  <Select
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    label="Price Range"
                    sx={{
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#cbd5e1",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#94a3b8",
                      },
                    }}
                  >
                    {priceRanges.map((range) => (
                      <MenuItem key={range.value} value={range.value}>
                        {range.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      fontWeight: 500,
                      color: "#64748b",
                    }}
                  >
                    Availability
                  </InputLabel>
                  <Select
                    value={availability}
                    onChange={handleAvailabilityChange}
                    label="Availability"
                    sx={{
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#cbd5e1",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#94a3b8",
                      },
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="available">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CheckCircleIcon color="success" size={16} />
                        In Stock
                      </Box>
                    </MenuItem>
                    <MenuItem value="unavailable">
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CancelIcon color="error" size={16} />
                        Out of Stock
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearchQuery("");
                    setPriceRange("");
                    setAvailability("all");
                    setSelectedCategories([]);
                    setPage(1);
                  }}
                  fullWidth
                  sx={{
                    height: "56px",
                    borderRadius: 2,
                    fontWeight: 500,
                    borderColor: "#cbd5e1",
                    color: "#475569",
                    "&:hover": {
                      borderColor: "#94a3b8",
                      backgroundColor: "#f8fafc",
                    },
                  }}
                >
                  Reset Filters
                </Button>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 600, color: "#334155" }}
                >
                  Categories
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                  {allCategories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      clickable
                      color={
                        selectedCategories.includes(category)
                          ? "primary"
                          : "default"
                      }
                      onClick={() => handleCategoryClick(category)}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 500,
                        "&.MuiChip-colorPrimary": {
                          backgroundColor: "#dbeafe",
                          color: "#1d4ed8",
                        },
                        "&.MuiChip-clickable:hover": {
                          backgroundColor: selectedCategories.includes(category)
                            ? "#bfdbfe"
                            : "#f1f5f9",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Card>
          )}
        </Box>

        {/* Product List */}
        <InfiniteScroll
          dataLength={products.length}
          next={fetchProducts}
          hasMore={hasMore}
          loader={
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress sx={{ color: "#3b82f6" }} />
            </Box>
          }
          endMessage={
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{
                py: 6,
                fontWeight: 500,
                color: "#64748b",
              }}
            >
              {products.length > 0
                ? "You've reached the end of products"
                : "No products found matching your criteria"}
            </Typography>
          }
          style={{ overflow: "visible" }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: { xs: 3, md: 4 },
            }}
          >
            {loading && products.length === 0
              ? renderSkeletons()
              : products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
          </Box>
        </InfiniteScroll>
      </Box>

      {/* Product Detail Dialog */}
      {selectedProduct && (
        <ProductDetailDialog
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            setQuantity(1);
          }}
          onAddToCart={handleAddToCart}
          quantity={quantity}
          onQuantityChange={setQuantity}
          isOwnerView={false}
        />
      )}
    </Box>
  );
};

export default ProductsPage;
