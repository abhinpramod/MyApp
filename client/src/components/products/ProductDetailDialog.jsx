// components/products/ProductDetailDialog.jsx
import { 
    Dialog, 
    DialogContent, 
    DialogTitle, 
    IconButton, 
    Box, 
    Typography, 
    Chip, 
    Button, 
    TextField 
  } from "@mui/material";
  import { X, ShoppingCart } from "lucide-react";
  
  const ProductDetailDialog = ({ 
    product, 
    onClose, 
    onAddToCart, 
    quantity, 
    onQuantityChange,
    isOwnerView
  }) => {
    if (!product) return null;
  
    return (
      <Dialog
        open={!!product}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{ className: "rounded-xl" }}
      >
        <DialogTitle className="flex justify-between items-center border-b">
          <Typography variant="h6" className="font-bold">
            {product.name}
          </Typography>
          <IconButton onClick={onClose}>
            <X size={24} />
          </IconButton>
        </DialogTitle>
        <DialogContent className="py-4">
          <Box className="flex flex-col md:flex-row gap-6">
            <ProductImageSection image={product.image} name={product.name} />
            <ProductInfoSection 
              product={product} 
              onAddToCart={onAddToCart}
              quantity={quantity}
              onQuantityChange={onQuantityChange}
              isOwnerView={isOwnerView}
            />
          </Box>
        </DialogContent>
      </Dialog>
    );
  };
  
  const ProductImageSection = ({ image, name }) => (
    <Box className="w-full md:w-1/2">
      <img
        src={image}
        alt={name}
        className="w-full h-auto max-h-[60vh] object-contain rounded-lg border border-gray-200"
      />
    </Box>
  );
  
  const ProductInfoSection = ({ 
    product, 
    onAddToCart, 
    quantity, 
    onQuantityChange,
    isOwnerView
  }) => {
    return (
      <Box className="w-full md:w-1/2 space-y-4">
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
    );
  };
  
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
  
  const AddToCartSection = ({ product, quantity, onQuantityChange, onAddToCart }) => (
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
          onClick={onAddToCart}
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