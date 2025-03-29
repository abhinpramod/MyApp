import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Avatar,
  Typography,
  Chip,
  Divider,
  Box,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Camera, X, ShoppingCart } from "lucide-react";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";

const StoreProfile = () => {
  const { storeId: paramStoreId } = useParams();
  const isOwnerView = !paramStoreId;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // Fetch store data and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch store data
        const storeResponse = await axiosInstance.get(
          isOwnerView ? '/store/profile' : `/store/store/${paramStoreId}`,
          { withCredentials: true }
        );
        setStoreData(storeResponse.data);
        setProfileImagePreview(storeResponse.data.profilePicture);

        // Fetch products
        const productsResponse = await axiosInstance.get(
          isOwnerView ? '/products' : `/store/${paramStoreId}/products`,
          { withCredentials: true }
        );
        setProducts(productsResponse.data.products);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paramStoreId, isOwnerView]);

  const handleAddToCart = async () => {
    try {
      await axiosInstance.post('/cart/add', {
        productId: selectedProduct._id,
        quantity,
      }, { withCredentials: true });
      
      toast.success(`${quantity} ${selectedProduct.name} added to cart`);
      setSelectedProduct(null);
      setQuantity(1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const updateProfilePicture = async () => {
    try {
      const formData = new FormData();
      if (profileImage) {
        formData.append('image', profileImage);
      }

      const response = await axiosInstance.put('/store/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      setStoreData(prev => ({ ...prev, profilePicture: response.data.imageUrl }));
      setProfileImage(null);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile picture');
    }
  };

  const DetailRow = ({ label, value }) => (
    <Box className="flex justify-between">
      <Typography variant="body2" className="text-gray-600">
        {label}:
      </Typography>
      <Typography variant="body2" className="font-medium">
        {value || 'N/A'}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (!storeData) {
    return <Typography>Store not found</Typography>;
  }
  console.log(products);

  return (
    <>
      {!isOwnerView && <Navbar />}
      
      <Box 
        className={`p-4 md:p-6 min-h-screen max-w-6xl mx-auto shadow-lg rounded-2xl bg-white ${
          !isOwnerView ? "mt-16 md:mt-20" : ""
        }`}
      >
        {/* Store Header Section */}
        <Box className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Profile Column */}
          <Box className="w-full md:w-1/3 flex flex-col items-center">
            <Box className="relative mb-4">
              <Avatar
                sx={{ width: 150, height: 150 }}
                className="rounded-xl border-4 border-gray-100 shadow-sm"
                src={profileImagePreview || storeData.profilePicture}
              />
              {isOwnerView && (
                <>
                  <label className="absolute bottom-2 right-2 bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-700 transition-all">
                    <Camera className="w-5 h-5 text-white" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange}
                    />
                  </label>
                  {profileImage && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={updateProfilePicture}
                      className="mt-2"
                    >
                      Save Image
                    </Button>
                  )}
                </>
              )}
            </Box>
            
            <Typography variant="h5" className="font-bold text-center">
              {storeData.storeName}
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600 text-center">
              {storeData.ownerName}
            </Typography>
            
            <Chip 
              label={storeData.storeType} 
              color="primary" 
              className="mt-3 capitalize px-3 py-1"
              sx={{ fontWeight: 500, borderRadius: 1 }}
            />
            
            <Box className="w-full mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Typography variant="body1" className="text-gray-700">
                {storeData.description}
              </Typography>
            </Box>
          </Box>

          {/* Details Column */}
          <Box className="w-full md:w-2/3 space-y-4">
            <Typography variant="h6" className="font-semibold pb-2 border-b">
              Store Information
            </Typography>
            
            <Box className="space-y-3">
              <DetailItem label="Email" value={storeData.email} />
              <DetailItem label="Phone" value={storeData.phone} />
              <DetailItem label="GST Number" value={storeData.gstNumber} />
              <DetailItem 
                label="Address" 
                value={`${storeData.address}, ${storeData.city}, ${storeData.state}, ${storeData.country}`}
              />
            </Box>
          </Box>
        </Box>

        <Divider className="my-6" />

        {/* Products Section */}
        <Box className="mb-8">
          <Typography variant="h6" className="font-semibold mb-4">
            Our Products
          </Typography>
          
          {products.length === 0 ? (
            <Typography>No products available</Typography>
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard 
                    product={product} 
                    onClick={() => setSelectedProduct(product)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      {/* Product Detail Dialog with Add to Cart */}
      <Dialog
        open={!!selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          setQuantity(1);
        }}
        fullWidth
        maxWidth="md"
        PaperProps={{ className: "rounded-xl" }}
      >
        {selectedProduct && (
          <>
  <DialogTitle className="flex justify-between items-center border-b">
    <Typography variant="h6" className="font-bold">
      {selectedProduct.name}
    </Typography>
    <IconButton onClick={() => setSelectedProduct(null)}>
      <X size={24} />
    </IconButton>
  </DialogTitle>
  <DialogContent className="py-4">
    <Box className="flex flex-col md:flex-row gap-6">
      {/* Product Image Section */}
      <Box className="w-full md:w-1/2">
        <img
          src={selectedProduct.image}
          alt={selectedProduct.name}
          className="w-full h-auto max-h-[60vh] object-contain rounded-lg border border-gray-200"
        />
      </Box>

      {/* Product Details Section */}
      <Box className="w-full md:w-1/2 space-y-4">
        {/* Price and Stock */}
        <Box className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Typography variant="h5" className="font-bold text-gray-900">
            ₹{selectedProduct.basePrice.toLocaleString()}
            {selectedProduct.unit && <span className="text-sm ml-1">/{selectedProduct.unit}</span>}
          </Typography>
          <Box className="flex items-center gap-2 mt-2">
            <Chip 
              label={selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'} 
              color={selectedProduct.stock > 0 ? 'success' : 'error'} 
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              {selectedProduct.stock} units available
            </Typography>
          </Box>
        </Box>

        {/* Product Description */}
        <Box className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Typography variant="subtitle2" className="font-semibold mb-2">
            Description
          </Typography>
          <Typography variant="body1" className="text-gray-700">
            {selectedProduct.description}
          </Typography>
        </Box>

        {/* Product Specifications */}
        <Box className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <Typography variant="subtitle2" className="font-semibold mb-2">
            Specifications
          </Typography>
          <Box className="space-y-2">
            <DetailRow label="Category" value={selectedProduct.category} />
            <DetailRow label="Grade/Quality" value={selectedProduct.grade} />
            <DetailRow 
              label="Weight/Dimensions" 
              value={`${selectedProduct.weightPerUnit} ${selectedProduct.unit}`} 
            />
            <DetailRow 
              label="Manufacturer" 
              value={selectedProduct.manufacturer?.name || 'N/A'} 
            />
            {selectedProduct.specifications && (
              <DetailRow 
                label="Additional Specs" 
                value={selectedProduct.specifications} 
              />
            )}
          </Box>
        </Box>

        {/* Bulk Pricing (if available) */}
        {selectedProduct.bulkPricing?.length > 0 && (
          <Box className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <Typography variant="subtitle2" className="font-semibold mb-2">
              Bulk Pricing
            </Typography>
            <Box className="space-y-2">
              {selectedProduct.bulkPricing.map((bp, index) => (
                <Box key={index} className="flex justify-between">
                  <Typography variant="body2">
                    {bp.minQuantity}+ units:
                  </Typography>
                  <Typography variant="body2" className="font-medium">
                    ₹{bp.price.toLocaleString()} each
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Add to Cart Section */}
        <Box className="pt-4 border-t">
          <Typography variant="subtitle2" className="font-semibold mb-2">
            Order Quantity
          </Typography>
          <Box className="flex items-center gap-4">
            <TextField
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ 
                min: 1,
                max: selectedProduct.stock
              }}
              size="small"
              className="w-24"
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCart size={18} />}
              onClick={handleAddToCart}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={selectedProduct.stock <= 0}
              fullWidth
            >
              Add to Cart
            </Button>
          </Box>
          {selectedProduct.stock > 0 && (
            <Typography variant="caption" className="text-gray-500 block mt-2">
              Maximum {selectedProduct.stock} units available
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  </DialogContent>
</>        )}
      </Dialog>
    </>
  );
};

// Reusable Components (same as before)
const DetailItem = ({ label, value }) => (
  <Box>
    <Typography variant="subtitle2" className="font-medium text-gray-500">
      {label}
    </Typography>
    <Typography variant="body1" className="text-gray-800">
      {value}
    </Typography>
  </Box>
);

const ProductCard = ({ product, onClick }) => (
  <Card 
    className="h-full flex flex-col transition-all hover:shadow-lg cursor-pointer border border-gray-100"
    onClick={onClick}
  >
    <Box className="h-40 w-full overflow-hidden">
      <CardMedia
        component="img"
        className="w-full h-full object-cover transition-transform hover:scale-105"
        image={product.image}
        alt={product.name}
      />
    </Box>
    <CardContent className="flex-grow">
      <Typography variant="h6" className="font-semibold line-clamp-1">
        {product.name}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        className="mt-1 line-clamp-2"
      >
        {product.description}
      </Typography>
      <Box className="mt-2 flex justify-between items-center">
        <Typography variant="body1" className="font-bold text-gray-900">
          ₹{product. 
basePrice?.toLocaleString()}
          {product.unit && <span className="text-xs ml-1">/{product.unit}</span>}
        </Typography>
        <Chip 
          label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} 
          color={product.stock > 0 ? 'success' : 'error'} 
          size="small"
        />
      </Box>
    </CardContent>
  </Card>
);

export default StoreProfile;