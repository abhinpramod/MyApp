import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Box, 
  Typography, 
  Chip, 
  Button, 
  TextField,
  Avatar
} from "@mui/material";
import { X, ShoppingCart, MapPin, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductDetailDialog = ({ 
  product, 
  onClose, 
  onAddToCart, 
  quantity, 
  onQuantityChange,
  isOwnerView,
}) => {
  const navigate = useNavigate();
  if (!product) return null;
  
  const handleStoreClick = (storeId) => {
    return (e) => {
      e.stopPropagation();
      navigate(`/store/${product.storeId}`);
    };
  };

  return (
    <Dialog
      open={!!product}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ 
        className: "rounded-2xl shadow-xl overflow-hidden",
        sx: { backgroundColor: "#f8fafc" }
      }}
    >
      <DialogTitle className="flex justify-between items-center border-b border-gray-200 bg-white px-6 py-4">
        <Typography 
          variant="h6" 
          className="font-bold text-gray-900 text-xl"
          sx={{ color: "#1e293b" }}
        >
          {product.name}
        </Typography>
        <IconButton 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent className="py-6 px-6">
        <Box className="flex flex-col md:flex-row gap-8">
          <ProductImageSection image={product.image} name={product.name} />
          
          <Box className="w-full md:w-1/2 space-y-5">
            {product.store && (
              <StoreInfoSection 
                store={product.store} 
                onStoreClick={handleStoreClick(product.store.id)}
              />
            )}
            
            <PriceAndStockSection product={product} />
            
            <DescriptionSection description={product.description} />
            
            <SpecificationsSection product={product} />
            
            {product.bulkPricing?.length > 0 && (
              <BulkPricingSection bulkPricing={product.bulkPricing} />
            )}
            
            {!isOwnerView && (
              <AddToCartSection 
                product={product}
                quantity={quantity}
                onQuantityChange={onQuantityChange}
                onAddToCart={onAddToCart}
              />
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// Store Info Section
const StoreInfoSection = ({ store, onStoreClick }) => (
  <Box 
    onClick={onStoreClick}
    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:border-blue-300"
  >
    <Typography 
      variant="subtitle2" 
      className="font-semibold mb-3 text-gray-700"
      sx={{ fontSize: "0.95rem" }}
    >
      Sold By
    </Typography>
    
    <Box className="flex items-center gap-4">
      <Avatar 
        src={store.storeImage} 
        alt={store.storeName}
        sx={{ 
          width: 56, 
          height: 56,
          border: "2px solid #e2e8f0"
        }}
      />
      
      <Box>
        <Typography 
          variant="body1" 
          className="font-medium flex items-center gap-1.5 text-gray-900"
          sx={{ fontWeight: 600 }}
        >
          <Store size={18} className="text-blue-600" />
          {store.storeName}
        </Typography>
        
        <Typography 
          variant="body2" 
          className="text-gray-600 flex items-center gap-1.5 mt-1"
          sx={{ fontSize: "0.875rem" }}
        >
          <MapPin size={16} className="text-red-500" />
          {store.address}, {store.city}, {store.state}
        </Typography>
      </Box>
    </Box>
  </Box>
);

// Product Image Section
const ProductImageSection = ({ image, name }) => (
  <Box className="w-full md:w-1/2 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
    <img
      src={image}
      alt={name}
      className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
    />
  </Box>
);

// Price and Stock Section
const PriceAndStockSection = ({ product }) => (
  <Box className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
    <Typography 
      variant="h5" 
      className="font-bold text-gray-900"
      sx={{ color: "#0f172a", fontSize: "1.75rem" }}
    >
      ₹{product.basePrice.toLocaleString()}
      {product.unit && <span className="text-sm ml-1 text-gray-500">/{product.unit}</span>}
    </Typography>
    
    <Box className="flex items-center gap-3 mt-3">
      <Chip 
        label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} 
        color={product.stock > 0 ? 'success' : 'error'} 
        size="small"
        className="font-medium"
        sx={{ 
          borderRadius: "6px",
          fontWeight: 500
        }}
      />
      
      <Typography 
        variant="body2" 
        color="text.secondary"
        className="text-gray-600"
        sx={{ fontSize: "0.875rem" }}
      >
        {product.stock} units available
      </Typography>
    </Box>
  </Box>
);

// Description Section
const DescriptionSection = ({ description }) => (
  <Box className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
    <Typography 
      variant="subtitle2" 
      className="font-semibold mb-3 text-gray-700"
      sx={{ fontSize: "0.95rem" }}
    >
      Description
    </Typography>
    
    <Typography 
      variant="body1" 
      className="text-gray-700 leading-relaxed"
      sx={{ lineHeight: 1.6 }}
    >
      {description}
    </Typography>
  </Box>
);

// Specifications Section
const SpecificationsSection = ({ product }) => (
  <Box className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
    <Typography 
      variant="subtitle2" 
      className="font-semibold mb-4 text-gray-700"
      sx={{ fontSize: "0.95rem" }}
    >
      Specifications
    </Typography>
    
    <Box className="space-y-3">
      <DetailRow label="Category" value={product.category} />
      <DetailRow label="Grade/Quality" value={product.grade} />
      <DetailRow 
        label="Weight/Dimensions" 
        value={`${product.weightPerUnit} ${product.unit}`} 
      />
      <DetailRow 
        label="Manufacturer" 
        value={product.manufacturer?.name || 'N/A'} 
      />
      {product.specifications && (
        <DetailRow 
          label="Additional Specs" 
          value={product.specifications} 
        />
      )}
    </Box>
  </Box>
);

// Bulk Pricing Section
const BulkPricingSection = ({ bulkPricing }) => (
  <Box className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
    <Typography 
      variant="subtitle2" 
      className="font-semibold mb-4 text-gray-700"
      sx={{ fontSize: "0.95rem" }}
    >
      Bulk Pricing
    </Typography>
    
    <Box className="space-y-3">
      {bulkPricing.map((bp, index) => (
        <Box 
          key={index} 
          className="flex justify-between items-center py-1.5"
        >
          <Typography 
            variant="body2"
            className="text-gray-600"
            sx={{ fontSize: "0.875rem" }}
          >
            {bp.minQuantity}+ units:
          </Typography>
          
          <Typography 
            variant="body2" 
            className="font-medium text-gray-900"
            sx={{ fontWeight: 600 }}
          >
            ₹{bp.price.toLocaleString()} each
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

// Add to Cart Section
const AddToCartSection = ({ product, quantity, onQuantityChange, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart({
      product: product,
      storeId: product.storeId,
      quantity: quantity
    });
  };

  return (
    <Box className="pt-5 border-t border-gray-200">
      <Typography 
        variant="subtitle2" 
        className="font-semibold mb-3 text-gray-700"
        sx={{ fontSize: "0.95rem" }}
      >
        Order Quantity
      </Typography>
      
      <Box className="flex items-center gap-4">
        <TextField
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
          inputProps={{ 
            min: 1,
            max: product.stock
          }}
          size="small"
          className="w-24"
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "#fff",
              "& fieldset": { borderColor: "#d1d5db" },
              "&:hover fieldset": { borderColor: "#93c5fd" },
              "&.Mui-focused fieldset": { borderColor: "#3b82f6" }
            }
          }}
        />
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<ShoppingCart size={18} />}
          onClick={handleAddToCart}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={product.stock <= 0}
          fullWidth
          sx={{
            borderRadius: "8px",
            py: 1.2,
            fontWeight: 600,
            boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
            "&:hover": {
              boxShadow: "0 4px 8px rgba(59, 130, 246, 0.4)"
            },
            "&:disabled": {
              backgroundColor: "#d1d5db",
              color: "#9ca3af"
            }
          }}
        >
          Add to Cart
        </Button>
      </Box>
      
      {product.stock > 0 && (
        <Typography 
          variant="caption" 
          className="text-gray-500 block mt-3"
          sx={{ fontSize: "0.75rem" }}
        >
          Maximum {product.stock} units available
        </Typography>
      )}
    </Box>
  );
};

// Detail Row for Specifications
const DetailRow = ({ label, value }) => (
  <Box className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
    <Typography 
      variant="body2" 
      className="text-gray-600"
      sx={{ fontSize: "0.875rem" }}
    >
      {label}:
    </Typography>
    
    <Typography 
      variant="body2" 
      className="font-medium text-gray-900"
      sx={{ fontWeight: 500 }}
    >
      {value || 'N/A'}
    </Typography>
  </Box>
);

export default ProductDetailDialog;