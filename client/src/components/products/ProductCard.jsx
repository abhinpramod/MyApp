// components/products/ProductCard.jsx
import { Card, CardContent, CardMedia, Chip, Typography, Box } from "@mui/material";

const ProductCard = ({ product, onClick }) => (
  <Card 
    className="h-full flex flex-col transition-all duration-300 hover:shadow-xl cursor-pointer rounded-xl border border-gray-200 overflow-hidden bg-white"
    onClick={onClick}
    sx={{
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
      }
    }}
  >
    <Box className="h-48 w-full overflow-hidden relative">
      <CardMedia
        component="img"
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        image={product.image}
        alt={product.name}
      />
      {product.stock <= 0 && (
        <Box className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Typography className="text-white font-bold text-lg">Out of Stock</Typography>
        </Box>
      )}
    </Box>
    
    <CardContent className="flex-grow p-4">
      <Typography 
        variant="h6" 
        className="font-semibold line-clamp-1 text-gray-900"
        sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 1 }}
      >
        {product.name}
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        className="mt-1 line-clamp-2 text-gray-600"
        sx={{ lineHeight: 1.5, mb: 2 }}
      >
        {product.description}
      </Typography>
      
      <Box className="mt-3 flex justify-between items-center">
        <Typography 
          variant="body1" 
          className="font-bold text-gray-900"
          sx={{ 
            fontSize: '1.25rem', 
            fontWeight: 700,
            color: '#0f172a'
          }}
        >
          ₹{product.basePrice?.toLocaleString()}
          {product.unit && (
            <span className="text-sm ml-1 text-gray-500 font-normal">
              /{product.unit}
            </span>
          )}
        </Typography>
        
        <Chip 
          label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} 
          color={product.stock > 0 ? 'success' : 'error'} 
          size="small"
          className="font-medium"
          sx={{
            borderRadius: '6px',
            fontWeight: 500,
            '&.MuiChip-colorSuccess': {
              backgroundColor: '#dcfce7',
              color: '#166534'
            },
            '&.MuiChip-colorError': {
              backgroundColor: '#fee2e2',
              color: '#b91c1c'
            }
          }}
        />
      </Box>
      
      {product.bulkPricing && product.bulkPricing.length > 0 && (
        <Box className="mt-3">
          <Typography 
            variant="caption" 
            className="text-blue-600 font-medium"
            sx={{ fontSize: '0.75rem', fontWeight: 600 }}
          >
            Bulk pricing available
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

export default ProductCard;