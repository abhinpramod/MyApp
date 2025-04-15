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
  Avatar
} from "@mui/material";
import {
  X as CloseIcon,
  CheckCircle as CheckCircleIcon,
  XCircle as CancelIcon,
  Filter as FilterIcon,
  ChevronDown as KeyboardArrowDown,
  ChevronUp as KeyboardArrowUp,
  // ShoppingCart,
  Search as SearchIcon,
  MapPin,
ShoppingCart} from "lucide-react";
import axiosInstance from "../../lib/axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-hot-toast";
import { Skeleton } from "../../components/ui/skeleton";
import qs from 'qs';

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

  const fetchProducts = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      const params = {
        search: searchQuery,
        priceRange,
        availability: availability === "available" ? true : availability === "unavailable" ? false : undefined,
        categories: selectedCategories,
        page: currentPage,
        limit: 8
      };

      // Clean up undefined/empty params
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '' || 
            (Array.isArray(params[key]) && params[key].length === 0)) {
          delete params[key];
        }
      });

      const response = await axiosInstance.get("/products", {
        params,
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
      });
      
      if (reset) {
        setProducts(response.data.products);
        setPage(2);
      } else {
        setProducts(prev => [...prev, ...response.data.products]);
        setPage(prev => prev + 1);
      }
      
      setTotal(response.data.total);
      setHasMore(response.data.hasMore);

      if (reset && response.data.products.length > 0) {
        const categories = [...new Set(response.data.products.flatMap(p => p.category))];
        setAllCategories(categories);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch products');
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, priceRange, availability, selectedCategories]);

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
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
    setPage(1);
  };


  const handleAddToCart = async (cartItem) => {
   // Prevent triggering the card click event
   console.log("Adding to cart:", cartItem);
   const { product, storeId,quantity } = cartItem;
   const productId = product._id;
   const productname = product.name;
    // setIsAddingToCart(true);
    try {
      await axiosInstance.post("/cart/add-to-cart", {
        productId, storeId,quantity
      });

      toast.success(`${quantity} ${productname} added to cart successfully`);
 setSelectedProduct(null);

    } catch (error) {
      console.error("Failed to add product to cart", error);
      toast.error("Failed to add product to cart");
    } finally {
      // setIsAddingToCart(false);
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
    return Array(8).fill(0).map((_, index) => (
      <Card key={index} sx={{ height: 320 }}>
        <Box sx={{ height: 140, bgcolor: 'grey.300' }} />
        <CardContent>
          <Box sx={{ pt: 0.5 }}>
            <Skeleton width="60%" />
            <Skeleton width="40%" />
            <Skeleton width="30%" />
          </Box>
        </CardContent>
      </Card>
    ));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 3, py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Discover Our Products
          </Typography>
          <div style={{ position: 'relative', width: '100%' }}>
      {/* Centered Subtitle */}
      <Typography
        variant="subtitle1"
        color="text.secondary"
        style={{ textAlign: 'center' }}
      >
        Browse through our extensive collection of high-quality products
      </Typography>

      {/* Cart Button to the Right */}
      <button
        onClick={() => navigate('/cart')}
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 12px',
          border: 'none',
          backgroundColor: '#1976d2',
          color: 'white',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        <ShoppingCart size={18} />
        Cart
      </button>
    </div>        </Box>

        {/* Search and Filters Section */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products by name, category, store, or description..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {products.length} of {total} products
            </Typography>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              endIcon={showFilters ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ textTransform: 'none' }}
            >
              Filters
            </Button>
          </Box>

          {showFilters && (
            <Card sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Price Range</InputLabel>
                  <Select
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    label="Price Range"
                  >
                    {priceRanges.map((range) => (
                      <MenuItem key={range.value} value={range.value}>
                        {range.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Availability</InputLabel>
                  <Select
                    value={availability}
                    onChange={handleAvailabilityChange}
                    label="Availability"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="available">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon color="success" size={16} />
                        In Stock
                      </Box>
                    </MenuItem>
                    <MenuItem value="unavailable">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                  sx={{ height: '56px' }}
                >
                  Reset Filters
                </Button>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Categories
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {allCategories.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      clickable
                      color={selectedCategories.includes(category) ? "primary" : "default"}
                      onClick={() => handleCategoryClick(category)}
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
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          }
          endMessage={
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
              {products.length > 0 ? "You've reached the end of products" : "No products found matching your criteria"}
            </Typography>
          }
          style={{ overflow: 'visible' }}
        >
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)', 
              lg: 'repeat(4, 1fr)' 
            }, 
            gap: 3 
          }}>
            {loading && products.length === 0 ? (
              renderSkeletons()
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))
            )}
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