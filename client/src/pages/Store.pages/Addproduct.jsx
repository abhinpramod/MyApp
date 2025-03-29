import React, { useState, useEffect } from 'react';
import { 
  Tabs, Tab, Box, Typography, Button, CircularProgress, Paper,
  TextField, FormControl, InputLabel, Select, MenuItem, Switch,
  FormControlLabel, Avatar, Grid, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, Alert, Snackbar,
  Pagination, InputAdornment, useMediaQuery, useTheme
} from '@mui/material';
import { Camera, Plus, Trash2, PenSquare, Search } from 'lucide-react';
import axiosInstance from '../../lib/axios';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // State for tabs
  const [tabValue, setTabValue] = useState(0);
  
  // State for product list
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // State for add/edit form
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Cement',
    grade: '',
    weightPerUnit: '',
    unit: 'kg',
    manufacturerName: '',
    manufacturerCountry: '',
    basePrice: '',
    bulkPricing: [],
    stock: '',
    specifications: '',
    isActive: true,
    image: null
  });
  const [newBulkPricing, setNewBulkPricing] = useState({
    minQuantity: '',
    price: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await axiosInstance.get('/products', {
        params: {
          page,
          search: searchTerm,
          filter,
          limit: 10
        },
        withCredentials: true
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, filter]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      resetForm();
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Cement',
      grade: '',
      weightPerUnit: '',
      unit: 'kg',
      manufacturerName: '',
      manufacturerCountry: '',
      basePrice: '',
      bulkPricing: [],
      stock: '',
      specifications: '',
      isActive: true,
      image: null
    });
    setNewBulkPricing({
      minQuantity: '',
      price: ''
    });
    setImagePreview(null);
    setIsEditing(false);
    setCurrentProductId(null);
  };

  // Load product data for editing
  const loadProductForEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      grade: product.grade,
      weightPerUnit: product.weightPerUnit,
      unit: product.unit,
      manufacturerName: product.manufacturer.name,
      manufacturerCountry: product.manufacturer.country || '',
      basePrice: product.basePrice,
      bulkPricing: product.bulkPricing,
      stock: product.stock,
      specifications: product.specifications || '',
      isActive: product.isActive,
      image: null
    });
    setImagePreview(product.image);
    setIsEditing(true);
    setCurrentProductId(product._id);
    setTabValue(1);
  };

  // Form field handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBulkPricingChange = (e) => {
    const { name, value } = e.target;
    setNewBulkPricing(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addBulkPricing = () => {
    if (newBulkPricing.minQuantity && newBulkPricing.price) {
      setFormData(prev => ({
        ...prev,
        bulkPricing: [
          ...prev.bulkPricing,
          {
            minQuantity: parseInt(newBulkPricing.minQuantity),
            price: parseFloat(newBulkPricing.price)
          }
        ]
      }));
      setNewBulkPricing({ minQuantity: '', price: '' });
    }
  };

  const removeBulkPricing = (index) => {
    setFormData(prev => ({
      ...prev,
      bulkPricing: prev.bulkPricing.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError('');

    // Validate required fields
    const requiredFields = [
      'name', 'grade', 'weightPerUnit', 
      'manufacturerName', 'basePrice', 'stock'
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError('Please fill all required fields');
      setLoadingSubmit(false);
      return;
    }

    if (!isEditing && !formData.image) {
      setError('Please upload an image');
      setLoadingSubmit(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('grade', formData.grade);
      formDataToSend.append('weightPerUnit', formData.weightPerUnit);
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('manufacturerName', formData.manufacturerName);
      formDataToSend.append('manufacturerCountry', formData.manufacturerCountry);
      formDataToSend.append('basePrice', formData.basePrice);
      formDataToSend.append('bulkPricing', JSON.stringify(formData.bulkPricing));
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('specifications', formData.specifications);
      formDataToSend.append('isActive', formData.isActive);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (isEditing) {
        await axiosInstance.put(`/products/${currentProductId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });
        setSnackbarMessage('Product updated successfully');
      } else {
        await axiosInstance.post('/products', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });
        setSnackbarMessage('Product added successfully');
      }

      setSnackbarOpen(true);
      fetchProducts();
      resetForm();
      setTabValue(0);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'add'} product`);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Product deletion
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/products/${productToDelete._id}`, {
        withCredentials: true
      });
      setSnackbarMessage('Product deleted successfully');
      setSnackbarOpen(true);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontSize: isMobile ? '1.5rem' : '2.125rem' }}>
        Building Materials Management
      </Typography>
      
      <Paper elevation={3} sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab label="Manage Products" />
          <Tab label={isEditing ? "Edit Product" : "Add New Product"} />
        </Tabs>
      </Paper>

      {tabValue === 0 ? (
        <Paper elevation={3} sx={{ p: isMobile ? 1 : 3 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row', 
            justifyContent: 'space-between', 
            mb: 3,
            gap: isMobile ? 2 : 0
          }}>
            <TextField
              placeholder="Search materials..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: isMobile ? '100%' : 300 }}
            />
            
            <FormControl sx={{ minWidth: isMobile ? '100%' : 180 }} size="small">
              <InputLabel>Filter</InputLabel>
              <Select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
                label="Filter"
                sx={{ width: isMobile ? '100%' : 180 }}
              >
                <MenuItem value="all">All Materials</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TableContainer component={Paper}>
            <Table size={isMobile ? 'small' : 'medium'}>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  {!isMobile && <TableCell>Image</TableCell>}
                  <TableCell>Material</TableCell>
                  {!isMobile && <TableCell>Grade</TableCell>}
                  {!isMobile && <TableCell>Category</TableCell>}
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  {!isMobile && <TableCell>Status</TableCell>}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingProducts ? (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 4 : 8} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : products?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 4 : 8} align="center">
                      No building materials found
                    </TableCell>
                  </TableRow>
                ) : (
                  products?.map((product) => (
                    <TableRow key={product._id} hover>
                      {!isMobile && (
                        <TableCell>
                          <Avatar 
                            src={product.image} 
                            variant="rounded"
                            sx={{ width: 56, height: 56 }}
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Typography fontWeight="bold">{product.name}</Typography>
                        {isMobile && (
                          <>
                            <Typography variant="body2" color="textSecondary">
                              {product.grade} | {product.category}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              ${product.basePrice.toFixed(2)} / {product.unit}
                            </Typography>
                          </>
                        )}
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell>
                            <Chip label={product.grade} size="small" />
                          </TableCell>
                          <TableCell>
                            <Chip label={product.category} size="small" />
                          </TableCell>
                        </>
                      )}
                      {!isMobile && (
                        <TableCell>
                          ${product.basePrice.toFixed(2)} / {product.unit}
                          {product.bulkPricing.length > 0 && (
                            <Typography variant="caption" display="block">
                              + {product.bulkPricing.length} bulk options
                            </Typography>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        <Chip 
                          label={product.stock} 
                          color={product.stock > 0 ? 'success' : 'error'} 
                          size={isMobile ? 'small' : 'medium'}
                        />
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Chip 
                            label={product.isActive ? 'Active' : 'Inactive'} 
                            color={product.isActive ? 'success' : 'default'} 
                          />
                        </TableCell>
                      )}
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            onClick={() => loadProductForEdit(product)}
                            size={isMobile ? 'small' : 'medium'}
                          >
                            <PenSquare className="w-4 h-4 text-primary" />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDeleteClick(product)}
                            size={isMobile ? 'small' : 'medium'}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(e, value) => setPage(value)} 
                color="primary"
                size={isMobile ? 'small' : 'medium'}
              />
            </Box>
          )}
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ p: isMobile ? 1 : 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
            {isEditing ? 'Edit Building Material' : 'Add New Building Material'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={isMobile ? 1 : 3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ mb: 2 }}>
                  {!isEditing ? (
                    <>
                      <input
                        accept="image/*"
                        id="product-image-upload"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                      />
                      <label htmlFor="product-image-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<Camera className="w-4 h-4" />}
                          fullWidth
                          sx={{ mb: 1 }}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          Upload Image
                        </Button>
                      </label>
                    </>
                  ) : null}
                  
                  {imagePreview ? (
                    <Avatar
                      src={imagePreview}
                      variant="rounded"
                      sx={{ 
                        width: '100%', 
                        height: 'auto', 
                        aspectRatio: '1/1',
                        maxWidth: isMobile ? '150px' : '100%',
                        mx: isMobile ? 'auto' : 0,
                        display: 'block'
                      }}
                    />
                  ) : (
                    <Box sx={{ 
                      width: '100%', 
                      height: 0, 
                      paddingBottom: '100%',
                      border: '1px dashed grey',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      maxWidth: isMobile ? '150px' : '100%',
                      mx: isMobile ? 'auto' : 0
                    }}>
                      <Typography className='text-center font-semibold' color="textSecondary">
                        {isEditing ? 'Existing image' : 'No image selected '}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Grid container spacing={isMobile ? 1 : 2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Material Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      fullWidth
                      required
                      disabled={isEditing}
                      size={isMobile ? 'small' : 'medium'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Grade/Quality *"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      fullWidth
                      required
                      size={isMobile ? 'small' : 'medium'}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      fullWidth
                      multiline
                      rows={isMobile ? 2 : 3}
                      size={isMobile ? 'small' : 'medium'}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                      <InputLabel>Category *</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        label="Category *"
                        required
                      >
                        <MenuItem value="Cement">Cement</MenuItem>
                        <MenuItem value="Steel">Steel</MenuItem>
                        <MenuItem value="Wood">Wood</MenuItem>
                        <MenuItem value="Bricks">Bricks</MenuItem>
                        <MenuItem value="Aggregates">Aggregates</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
                      <InputLabel>Unit *</InputLabel>
                      <Select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        label="Unit *"
                        required
                      >
                        <MenuItem value="kg">Kilogram (kg)</MenuItem>
                        <MenuItem value="ton">Ton</MenuItem>
                        <MenuItem value="piece">Piece</MenuItem>
                        <MenuItem value="bag">Bag</MenuItem>
                        <MenuItem value="cubic meter">Cubic Meter</MenuItem>
                        <MenuItem value="square meter">Square Meter</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Weight Per Unit *"
                      name="weightPerUnit"
                      type="number"
                      value={formData.weightPerUnit}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                      size={isMobile ? 'small' : 'medium'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Base Price *"
                      name="basePrice"
                      type="number"
                      value={formData.basePrice}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                      }}
                      size={isMobile ? 'small' : 'medium'}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Manufacturer Details
                    </Typography>
                    <Grid container spacing={isMobile ? 1 : 2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Manufacturer Name *"
                          name="manufacturerName"
                          value={formData.manufacturerName}
                          onChange={handleChange}
                          fullWidth
                          required
                          size={isMobile ? 'small' : 'medium'}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Country"
                          name="manufacturerCountry"
                          value={formData.manufacturerCountry}
                          onChange={handleChange}
                          fullWidth
                          size={isMobile ? 'small' : 'medium'}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Bulk Pricing Options
                    </Typography>
                    <Grid container spacing={isMobile ? 1 : 2} alignItems="center">
                      <Grid item xs={5}>
                        <TextField
                          label="Min Quantity"
                          name="minQuantity"
                          type="number"
                          value={newBulkPricing.minQuantity}
                          onChange={handleBulkPricingChange}
                          fullWidth
                          inputProps={{ min: 1 }}
                          size={isMobile ? 'small' : 'medium'}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          label="Price"
                          name="price"
                          type="number"
                          value={newBulkPricing.price}
                          onChange={handleBulkPricingChange}
                          fullWidth
                          inputProps={{ min: 0, step: 0.01 }}
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                          }}
                          size={isMobile ? 'small' : 'medium'}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton 
                          onClick={addBulkPricing}
                          disabled={!newBulkPricing.minQuantity || !newBulkPricing.price}
                          size={isMobile ? 'small' : 'medium'}
                        >
                          <Plus className="w-4 h-4" />
                        </IconButton>
                      </Grid>
                    </Grid>

                    {formData.bulkPricing.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        {formData.bulkPricing.map((bp, index) => (
                          <Box key={index} sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1,
                            backgroundColor: '#f5f5f5',
                            borderRadius: 1,
                            mb: 1
                          }}>
                            <Typography variant={isMobile ? 'body2' : 'body1'}>
                              {bp.minQuantity}+ units: ${bp.price.toFixed(2)} each
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => removeBulkPricing(index)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Stock Quantity *"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ min: 0 }}
                      size={isMobile ? 'small' : 'medium'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Specifications"
                      name="specifications"
                      value={formData.specifications}
                      onChange={handleChange}
                      fullWidth
                      placeholder="e.g., Grade 43, 20mm thickness"
                      size={isMobile ? 'small' : 'medium'}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleChange}
                          color="primary"
                          size={isMobile ? 'small' : 'medium'}
                        />
                      }
                      label="Active Product"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Box sx={{ 
              mt: 3, 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2,
              flexDirection: isMobile ? 'column' : 'row'
            }}>
              <Button
                variant="outlined"
                onClick={() => {
                  resetForm();
                  setTabValue(0);
                }}
                fullWidth={isMobile}
                size={isMobile ? 'small' : 'medium'}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ 
                  px: isMobile ? 2 : 4, 
                  py: isMobile ? 1 : 1.5,
                  width: isMobile ? '100%' : 'auto'
                }}
                size={isMobile ? 'small' : 'large'}
                disabled={loadingSubmit}
              >
                {loadingSubmit ? (
                  <CircularProgress size={24} />
                ) : isEditing ? (
                  'Update Material'
                ) : (
                  'Add Material'
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteConfirmOpen} 
        onClose={() => setDeleteConfirmOpen(false)}
        fullScreen={isMobile}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)}
            size={isMobile ? 'small' : 'medium'}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            size={isMobile ? 'small' : 'medium'}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: isMobile ? 'bottom' : 'top',
          horizontal: 'right'
        }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductManagement;