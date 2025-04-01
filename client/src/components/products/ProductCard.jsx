// components/products/ProductCard.jsx
import { Card, CardContent, CardMedia, Chip, Typography, Box } from "@mui/material";

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
          ₹{product.basePrice?.toLocaleString()}
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

export default ProductCard;