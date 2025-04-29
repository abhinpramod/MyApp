import { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ShoppingCart, 
  Trash2, 
  Edit2, 
  Plus, 
  Minus,
  Store,
  Check,
  ArrowLeft,
  HardHat,
  Warehouse,
  Loader2
} from 'lucide-react';
import Card from '@/components/ui/card';
import CardContent from '@/components/ui/card-content';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dailog";
import ProductDetailDialog from '@/components/products/ProductDetailDialog';

const ShoppingCartUI = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Fetch cart data
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get('/cart');
        setCart(data.cart || { items: [], totalPrice: 0 });
        
        if (data.cart?.items?.length > 0) {
          const storesRes = await axiosInstance.get('/cart/stores');
          setStores(storesRes.data.stores || []);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to load cart data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, []);

  // Update item quantity
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setIsMutating(true);
      const { data } = await axiosInstance.put('/cart/update', {
        productId, // Only need productId now
        quantity: newQuantity
      });
      
      // Update local state optimistically
      setCart(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.productId === productId 
            ? { ...item, quantity: newQuantity } 
            : item
        ),
        totalPrice: data.cart?.totalPrice || prev.totalPrice
      }));
      
      toast.success("Quantity updated successfully");
    } catch (error) {
      console.error("Error updating quantity:", error);
      const message = error.response?.data?.message || "Failed to update quantity";
      toast.error(message);
      
      // Revert optimistic update on error
      const { data } = await axiosInstance.get('/cart');
      setCart(data.cart || { items: [], totalPrice: 0 });
    } finally {
      setIsMutating(false);
    }
  };

  // Remove item from cart
  const handleRemoveProduct = async (productId) => {
    try {
      setIsMutating(true);
      const { data } = await axiosInstance.post('/cart/remove', {
        productId // Only need productId now
      });
      
      // Update local state
      if (data.cart) {
        setCart(data.cart);
        // Refresh stores list if needed
        if (data.cart.items.length === 0) {
          setStores([]);
          setSelectedStore(null);
        }
      } else {
        setCart({ items: [], totalPrice: 0 });
        setStores([]);
        setSelectedStore(null);
      }
      
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error(error.response?.data?.message || "Failed to remove item");
    } finally {
      setIsMutating(false);
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    try {
      setIsMutating(true);
      await axiosInstance.delete('/cart/clear');
      setCart({ items: [], totalPrice: 0 });
      setStores([]);
      setSelectedStore(null);
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    } finally {
      setIsMutating(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsMutating(true);
      setIsCheckoutOpen(true);
      console.log("Checkout triggered");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Failed to proceed with checkout");
    } finally {
      setIsMutating(false);
    }
  };

  // Filter items by store and ensure productDetails exists
  const filteredItems = (selectedStore
    ? cart.items.filter(item => 
        item.productDetails?.storeId === selectedStore || 
        item.storeId === selectedStore
      )
    : cart.items
  ).filter(item => item.productDetails); // Ensure productDetails exists

  // Calculate store-specific total
  const calculateStoreTotal = (storeId) => {
    return cart.items
      .filter(item => 
        (item.productDetails?.storeId === storeId) || 
        (item.storeId === storeId)
      )
      .reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
  };

  // Calculate grand total
  const grandTotal = cart.items.reduce(
    (sum, item) => sum + (item.basePrice * item.quantity), 
    0
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Error state (if cart is undefined due to error)
  if (!cart) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <Card>
          <CardContent className="p-8 text-center">
            <HardHat className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Error loading your cart</h3>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          Shopping Cart
          {cart.items.length > 0 && (
            <Badge className="ml-2">
              {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
            </Badge>
          )}
        </h1>
      </div>

      {/* Edit Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={handleClearCart}
          disabled={!cart.items.length || isMutating}
          className="gap-2 w-full sm:w-auto"
        >
          {isMutating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          Clear Cart
        </Button>
        
        <Button 
          variant={isEditing ? 'default' : 'outline'} 
          onClick={() => setIsEditing(!isEditing)}
          className="gap-2 w-full sm:w-auto"
          disabled={!cart.items.length}
        >
          {isEditing ? (
            <>
              <Check className="w-4 h-4" />
              Done Editing
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit Cart
            </>
          )}
        </Button>
      </div>

      {/* Store Filter */}
      {cart.items.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={!selectedStore ? 'default' : 'outline'}
            onClick={() => setSelectedStore(null)}
            className="gap-2 whitespace-nowrap"
          >
            <Warehouse className="w-4 h-4" />
            All Stores
            <Badge className="ml-1">
              {cart.items.length}
            </Badge>
          </Button>
          
          {stores.map(store => (
            <Button
              key={store._id}
              variant={selectedStore === store._id ? 'default' : 'outline'}
              onClick={() => setSelectedStore(store._id)}
              className="gap-2 whitespace-nowrap"
            >
              <Store className="w-4 h-4" />
              {store.storeName}
              <Badge className="ml-1">
                {cart.items.filter(item => 
                  item.productDetails?.storeId === store._id || 
                  item.storeId === store._id
                ).length}
              </Badge>
            </Button>
          ))}
        </div>
      )}

      {/* Cart Items */}
      <div className="space-y-6">
        {filteredItems.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              {filteredItems.map(item => (
                <div 
                  key={item.productId} 
                  className="flex flex-col sm:flex-row items-start sm:items-center p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors gap-4"
                  onClick={() => setSelectedProduct(item.productDetails)}
                >
                  <div className="flex-shrink-0 w-full sm:w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={item.productDetails?.image || '/placeholder-product.jpg'}
                      alt={item.productDetails?.name || 'Product'} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-0 sm:ml-4 flex-grow w-full">
                    <h3 className="font-medium">{item.productDetails?.name || 'Unknown Product'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.productDetails?.grade} {item.productDetails?.category}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.productDetails?.weightPerUnit}{item.productDetails?.unit} × ₹{item.basePrice}
                    </p>
                  </div>
                  <div className="ml-0 sm:ml-4 flex items-center w-full sm:w-auto justify-between sm:justify-normal">
                    {isEditing ? (
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-normal">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(item.productId, item.quantity - 1);
                          }}
                          disabled={isMutating}
                          className="flex-shrink-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(item.productId, parseInt(e.target.value) || 1);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-16 text-center mx-2"
                          min="1"
                          disabled={isMutating}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(item.productId, item.quantity + 1);
                          }}
                          disabled={isMutating}
                          className="flex-shrink-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveProduct(item.productId);
                          }}
                          disabled={isMutating}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{(item.basePrice * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} {item.quantity > 1 ? 'units' : 'unit'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <HardHat className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">
                {selectedStore 
                  ? `No items from ${stores.find(s => s._id === selectedStore)?.storeName} in your cart`
                  : "Your cart is empty"}
              </h3>
              <Button 
                className="mt-4"
                onClick={() => navigate('/stores')}
              >
                Browse Stores
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Summary */}
      {filteredItems.length > 0 && (
        <Card className="mt-6">
          <CardContent>
            <h1 className='text-2xl font-bold mb-4'>
              {selectedStore 
                ? `Order Summary (${stores.find(s => s._id === selectedStore)?.storeName})`
                : "Order Summary"}
            </h1>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  ₹{selectedStore 
                    ? calculateStoreTotal(selectedStore).toFixed(2)
                    : grandTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>
                  ₹{selectedStore 
                    ? calculateStoreTotal(selectedStore).toFixed(2)
                    : grandTotal.toFixed(2)}
                </span>
              </div>
              <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4" size="lg" onClick={handleCheckout}>
                    Proceed to Checkout
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Confirm Order</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Order Summary</h4>
                      {filteredItems.map(item => (
                        <div key={item.productId} className="flex justify-between py-2">
                          <span className="truncate max-w-[180px]">
                            {item.productDetails?.name} × {item.quantity}
                          </span>
                          <span>₹{(item.basePrice * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between border-t pt-2 mt-2 font-medium">
                        <span>Total</span>
                        <span>
                          ₹{selectedStore 
                            ? calculateStoreTotal(selectedStore).toFixed(2)
                            : grandTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button className="w-full" size="lg">
                      Place Order
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Detail Dialog */}
      {selectedProduct && (
        <ProductDetailDialog
          product={{
            ...selectedProduct,
            store: stores.find(s => s._id === selectedProduct.storeId),
            storeId: selectedProduct.storeId
          }}
          onClose={() => setSelectedProduct(null)}
          quantity={
            cart.items.find(item => item.productId === selectedProduct._id)?.quantity || 1
          }
          onQuantityChange={(newQuantity) => {
            handleQuantityChange(selectedProduct._id, newQuantity);
          }}
          isOwnerView={false}
        />
      )}
    </div>
  );
};

export default ShoppingCartUI;