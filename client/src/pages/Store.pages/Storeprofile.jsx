import { useState } from "react";
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
} from "@mui/material";
import { Camera, X, ShoppingCart } from "lucide-react";
import Navbar from "../../components/Navbar";

// Static store data for building materials
const staticStore = {
  storeName: "Premium Building Supplies",
  ownerName: "Rajesh Kumar",
  country: "India",
  state: "Tamil Nadu",
  city: "Chennai",
  address: "78 Construction Lane, Guindy",
  email: "sales@premiumbuild.com",
  phone: "+91 9876543210",
  storeType: "Building Materials",
  gstNumber: "33AAACP1234D1Z2",
  profilePicture: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop",
  description: "Your trusted supplier of high-quality building materials since 2010. We provide everything from cement to finishing materials for your construction needs.",
  products: [
    {
      _id: "1",
      name: "UltraTech Cement (50kg)",
      description: "Premium grade Portland cement suitable for all construction work. ISI certified.",
      price: 420,
      image: "https://images.unsplash.com/photo-1611273426858-450d0e9a0fcf?w=500&auto=format&fit=crop",
      createdAt: "2023-11-15T08:30:00Z",
      stock: "In Stock"
    },
    {
      _id: "2",
      name: "TMT Steel Bars (12mm)",
      description: "Fe-500 grade thermo-mechanically treated steel bars. Corrosion resistant.",
      price: 82500,
      unit: "per ton",
      image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a9d6?w=500&auto=format&fit=crop",
      createdAt: "2023-11-10T11:45:00Z",
      stock: "In Stock"
    },
    {
      _id: "3",
      name: "Birla White Putty (20kg)",
      description: "Premium wall putty for smooth finishing. Ready to use formulation.",
      price: 650,
      image: "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=500&auto=format&fit=crop",
      createdAt: "2023-11-05T14:15:00Z",
      stock: "In Stock"
    },
    {
      _id: "4",
      name: "Asian Paints Royale (1L)",
      description: "Luxury emulsion paint with stain guard technology. 200+ shades available.",
      price: 850,
      image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=500&auto=format&fit=crop",
      createdAt: "2023-10-28T09:20:00Z",
      stock: "In Stock"
    },
    {
      _id: "5",
      name: "Kajaria Tiles (2x2 ft)",
      description: "Ceramic floor tiles - wood finish. Pack of 5 pieces (20 sq.ft total).",
      price: 3200,
      image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=500&auto=format&fit=crop",
      createdAt: "2023-10-20T16:30:00Z",
      stock: "In Stock"
    },
    {
      _id: "6",
      name: "PVC Pipes (3 inch)",
      description: "Heavy-duty plumbing pipes. 10 feet length. ISI marked.",
      price: 1200,
      unit: "per piece",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&auto=format&fit=crop",
      createdAt: "2023-10-15T10:15:00Z",
      stock: "In Stock"
    }
  ]
};

const StoreProfile = () => {
  const { storeId: paramStoreId } = useParams();
  const isOwnerView = !paramStoreId;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // In a real app, this would add to cart
    alert(`${quantity} ${selectedProduct.name} added to cart`);
    setSelectedProduct(null);
    setQuantity(1);
  };

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
                src={staticStore.profilePicture}
              />
              {isOwnerView && (
                <label className="absolute bottom-2 right-2 bg-gray-800 p-2 rounded-full cursor-pointer hover:bg-gray-700 transition-all">
                  <Camera className="w-5 h-5 text-white" />
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              )}
            </Box>
            
            <Typography variant="h5" className="font-bold text-center">
              {staticStore.storeName}
            </Typography>
            <Typography variant="subtitle1" className="text-gray-600 text-center">
              {staticStore.ownerName}
            </Typography>
            
            <Chip 
              label={staticStore.storeType} 
              color="primary" 
              className="mt-3 capitalize px-3 py-1"
              sx={{ fontWeight: 500, borderRadius: 1 }}
            />
            
            <Box className="w-full mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Typography variant="body1" className="text-gray-700">
                {staticStore.description}
              </Typography>
            </Box>
          </Box>

          {/* Details Column */}
          <Box className="w-full md:w-2/3 space-y-4">
            <Typography variant="h6" className="font-semibold pb-2 border-b">
              Store Information
            </Typography>
            
            <Box className="space-y-3">
              <DetailItem label="Email" value={staticStore.email} />
              <DetailItem label="Phone" value={staticStore.phone} />
              <DetailItem label="GST Number" value={staticStore.gstNumber} />
              <DetailItem 
                label="Address" 
                value={`${staticStore.address}, ${staticStore.city}, ${staticStore.state}, ${staticStore.country}`}
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
          
          <Grid container spacing={3}>
            {staticStore.products.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard 
                  product={product} 
                  onClick={() => setSelectedProduct(product)}
                />
              </Grid>
            ))}
          </Grid>
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
                <Box className="w-full md:w-1/2">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                  />
                </Box>
                <Box className="w-full md:w-1/2 space-y-4">
                  <Box>
                    <Typography variant="h5" className="font-bold text-gray-900">
                      ₹{selectedProduct.price.toLocaleString()}
                      {selectedProduct.unit && <span className="text-sm ml-1">/{selectedProduct.unit}</span>}
                    </Typography>
                    <Chip 
                      label={selectedProduct.stock} 
                      color="success" 
                      size="small"
                      className="mt-1"
                    />
                  </Box>
                  
                  <Typography variant="body1" className="text-gray-700">
                    {selectedProduct.description}
                  </Typography>
                  
                  <Box className="pt-4 border-t">
                    <Typography variant="body2" className="text-gray-500 mb-2">
                      Quantity
                    </Typography>
                    <Box className="flex items-center gap-4">
                      <TextField
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        inputProps={{ min: 1 }}
                        size="small"
                        className="w-24"
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<ShoppingCart size={18} />}
                        onClick={handleAddToCart}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

// Reusable Components
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
          ₹{product.price.toLocaleString()}
          {product.unit && <span className="text-xs ml-1">/{product.unit}</span>}
        </Typography>
        <Chip 
          label={product.stock} 
          color="success" 
          size="small"
        />
      </Box>
    </CardContent>
  </Card>
);

export default StoreProfile;