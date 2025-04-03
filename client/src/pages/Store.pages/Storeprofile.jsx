// pages/StoreProfile.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Divider,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";
import StoreHeader from "../../components/store/StoreHeader";
import StoreDetails from "../../components/store/StoreDetails";
import ProductCard from "../../components/products/ProductCard";
import ProductDetailDialog from "../../components/products/ProductDetailDialog";

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
  const [description, setDescription] = useState("");

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
        setDescription(storeResponse.data.description);

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

  const handleAddToCart = async (cartItem) => {
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const updateProfilePicture = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
      toast.success('Profile picture updated successfully');
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Failed to update profile picture');
    }
  };

  const updateDescription = async (newDescription) => {
    try {
      setLoading(true);
      await axiosInstance.put('/store/profile/description', {
        description: newDescription
      }, {
        withCredentials: true,
      });

      setStoreData(prev => ({ ...prev, description: newDescription }));
      toast.success('Description updated successfully');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Failed to update description');
    }
  };

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

  return (
    <>
      {!isOwnerView && <Navbar />}
      
      <Box 
        className={`p-4 md:p-6 min-h-screen max-w-6xl mx-auto shadow-lg rounded-2xl bg-white ${
          !isOwnerView ? "mt-10 md:mt-20" : ""
        }`}
      >
        {/* Store Header Section */}
        <Box className="flex flex-col md:flex-row gap-6 mb-8">
          <StoreHeader
            storeData={storeData}
            isOwnerView={isOwnerView}
            onProfileImageChange={handleImageChange}
            profileImagePreview={profileImagePreview}
            onSaveProfileImage={updateProfilePicture}
            profileImage={profileImage}
            description={description}
            onDescriptionUpdate={updateDescription}
          />

          <StoreDetails storeData={storeData} />
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

      <ProductDetailDialog
        product={selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          setQuantity(1);
        }}
        onAddToCart={handleAddToCart}
        quantity={quantity}
        onQuantityChange={setQuantity}
        isOwnerView={isOwnerView}
      />
    </>
  );
};

export default StoreProfile;