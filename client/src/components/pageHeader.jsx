// components/PageHeader.jsx
import { Box, Typography, Badge } from '@mui/material';

const PageHeader = ({ orders, navigate, isMobile }) => {
  return (
    <Box sx={{ 
      mb: 4, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 2
    }}>
      <Typography variant="h4" sx={{ 
        fontWeight: 'bold',
        fontSize: isMobile ? '1.8rem' : '2.4rem'
      }}>
        Orders with Transportation Charges
      </Typography>
      
      <Badge 
        badgeContent={orders.length} 
        color="secondary" 
        sx={{ 
          '& .MuiBadge-badge': { 
            fontSize: '1rem', 
            height: 28, 
            minWidth: 28,
            borderRadius: '50%'
          } 
        }}
      >
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
          Pending Orders
        </Typography>
      </Badge>
    </Box>
  );
};

export default PageHeader;