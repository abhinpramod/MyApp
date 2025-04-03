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
      console.log("Navigating to store:", storeId);
      navigate(`/store/${product.storeId}`);
    };
  };

  return (
    <Dialog
      open={!!product}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ className: "rounded-xl" }}
    >
      <DialogTitle className="flex justify-between items-center border-b">
        <Typography variant="h6" className="font-bold text-gray-900">
          {product.name}
        </Typography>
        <IconButton onClick={onClose}>
          <X size={24} />
        </IconButton>
      </DialogTitle>
      <DialogContent className="py-4">
        <Box className="flex flex-col md:flex-row gap-6">
          <ProductImageSection image={product.image} name={product.name} />
          <Box className="w-full md:w-1/2 space-y-4">
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
    className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 cursor-pointer hover:bg-gray-100 transition-colors"
  >
    <Typography variant="subtitle2" className="font-semibold mb-2">
      Sold By
    </Typography>
    <Box className="flex items-center gap-3">
      <Avatar 
        src={store.storeImage} 
        alt={store.storeName}
        sx={{ width: 48, height: 48 }}
      />
      <Box>
        <Typography variant="body1" className="font-medium flex items-center gap-1">
          <Store size={16} />
          {store.storeName}
        </Typography>
        <Typography variant="body2" className="text-gray-600 flex items-center gap-1">
          <MapPin size={14} />
          {store.address}, {store.city}, {store.state}
        </Typography>
      </Box>
    </Box>
  </Box>
);

// Product Image Section
const ProductImageSection = ({ image, name }) => (
  <Box className="w-full md:w-1/2">
    <img
      src={image}
      alt={name}
      className="w-full h-auto max-h-[60vh] object-contain rounded-lg border border-gray-200 shadow-md"
    />
  </Box>
);

// Price and Stock Section
const PriceAndStockSection = ({ product }) => (
  <Box className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <Typography variant="h5" className="font-bold text-gray-900">
      ₹{product.basePrice.toLocaleString()}
      {product.unit && <span className="text-sm ml-1">/{product.unit}</span>}
    </Typography>
    <Box className="flex items-center gap-2 mt-2">
      <Chip 
        label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} 
        color={product.stock > 0 ? 'success' : 'error'} 
        size="small"
      />
      <Typography variant="body2" color="text.secondary">
        {product.stock} units available
      </Typography>
    </Box>
  </Box>
);

// Description Section
const DescriptionSection = ({ description }) => (
  <Box className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <Typography variant="subtitle2" className="font-semibold mb-2">
      Description
    </Typography>
    <Typography variant="body1" className="text-gray-700">
      {description}
    </Typography>
  </Box>
);

// Specifications Section
const SpecificationsSection = ({ product }) => (
  <Box className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <Typography variant="subtitle2" className="font-semibold mb-2">
      Specifications
    </Typography>
    <Box className="space-y-2">
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
  <Box className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <Typography variant="subtitle2" className="font-semibold mb-2">
      Bulk Pricing
    </Typography>
    <Box className="space-y-2">
      {bulkPricing.map((bp, index) => (
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
);

// Add to Cart Section
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
    <Box className="pt-4 border-t">
      <Typography variant="subtitle2" className="font-semibold mb-2">
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
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<ShoppingCart size={18} />}
          onClick={handleAddToCart}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={product.stock <= 0}
          fullWidth
        >
          Add to Cart
        </Button>
      </Box>
      {product.stock > 0 && (
        <Typography variant="caption" className="text-gray-500 block mt-2">
          Maximum {product.stock} units available
        </Typography>
      )}
    </Box>
  );
};

// Detail Row for Specifications
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

export default ProductDetailDialog;