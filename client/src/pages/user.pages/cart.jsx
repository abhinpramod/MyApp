import { useState } from 'react';
import  Card from '@/components/ui/card';
import CardContent from '@/components/ui/card-content';
import  Button  from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Warehouse
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dailog";
import { useNavigate } from 'react-router-dom';

// Mock data based on your database structure
const mockStores = [
  {
    _id: "67e7c601b014eb8e7bc2243c",
    storeName: "KK Steels",
    city: "Aroor",
    state: "Kerala",
    description: "We are providing building materials for the last 15 years",
    profilePicture: "https://via.placeholder.com/80?text=KK+Steels"
  },
  {
    _id: "67e8d701b014eb8e7bc2244d",
    storeName: "Cement World",
    city: "Kochi",
    state: "Kerala",
    description: "Premium cement and construction materials",
    profilePicture: "https://via.placeholder.com/80?text=Cement+World"
  }
];

const mockProducts = [
  {
    _id: "67e7eaa4a78f848009b740da",
    storeId: "67e7c601b014eb8e7bc2243c",
    name: "UltraTech Cement",
    description: "Best quality cement for all types of works",
    image: "https://via.placeholder.com/80?text=Cement",
    category: "Cement",
    grade: "53 Grade",
    weightPerUnit: 50,
    unit: "kg",
    basePrice: 600,
    stock: 200
  },
  {
    _id: "67e9901eedb0dfe7aa14350b",
    storeId: "67e7c601b014eb8e7bc2243c",
    name: "TMT Steel Bars",
    description: "Fe 500 grade steel rods",
    image: "https://via.placeholder.com/80?text=Steel+Bars",
    category: "Steel",
    grade: "Fe 500",
    weightPerUnit: 12,
    unit: "meter",
    basePrice: 850,
    stock: 150
  },
  {
    _id: "67e99123edb0dfe7aa1434da",
    storeId: "67e8d701b014eb8e7bc2244d",
    name: "Birla White Cement",
    description: "Premium white cement for finishing",
    image: "https://via.placeholder.com/80?text=White+Cement",
    category: "Cement",
    grade: "Premium",
    weightPerUnit: 5,
    unit: "kg",
    basePrice: 120,
    stock: 300
  }
];

const mockCart = {
  _id: "67ed416d66425309a57f2335",
  userId: "67dd42255f609c8c69a2d890",
  storeId: "67e7c601b014eb8e7bc2243c",
  items: [
    {
      productId: "67e7eaa4a78f848009b740da",
      quantity: 56,
      basePrice: 600,
      productDetails: mockProducts.find(p => p._id === "67e7eaa4a78f848009b740da")
    },
    {
      productId: "67e9901eedb0dfe7aa14350b",
      quantity: 2,
      basePrice: 850,
      productDetails: mockProducts.find(p => p._id === "67e9901eedb0dfe7aa14350b")
    }
  ],
  totalPrice: 600*56 + 850*2
};

const ShoppingCartUI = () => {
  const [cart, setCart] = useState(mockCart);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const navigate = useNavigate();

  // Get all stores present in cart
  const storesInCart = mockStores.filter(store => 
    cart.items.some(item => item.productDetails.storeId === store._id)
  );

  // Filter items by store
  const filteredItems = selectedStore
    ? cart.items.filter(item => item.productDetails.storeId === selectedStore)
    : cart.items;

  // Calculate store-specific total
  const calculateStoreTotal = (storeId) => {
    return cart.items
      .filter(item => item.productDetails.storeId === storeId)
      .reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
  };

  // Calculate grand total
  const grandTotal = cart.items.reduce(
    (sum, item) => sum + (item.basePrice * item.quantity), 
    0
  );

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart({
      ...cart,
      items: cart.items.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      ),
      totalPrice: cart.items.reduce((sum, item) => 
        sum + (item.basePrice * (item.productId === productId ? newQuantity : item.quantity)), 0)
    });
  };

  const handleRemoveProduct = (productId) => {
    setCart({
      ...cart,
      items: cart.items.filter(item => item.productId !== productId),
      totalPrice: cart.items
        .filter(item => item.productId !== productId)
        .reduce((sum, item) => sum + (item.basePrice * item.quantity), 0)
    });
  };

  const toggleStore = (storeId) => {
    setSelectedStore(selectedStore === storeId ? null : storeId);
  };

  const handleCheckout = () => {
    if (selectedStore) {
      // Checkout only from selected store
      console.log("Proceeding to checkout from store:", selectedStore);
    } else {
      // Checkout all items
      console.log("Proceeding to checkout all items");
    }
    setIsCheckoutOpen(true);
  };

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
          Building Materials Cart
        </h1>
      </div>

      {/* Edit Button */}
      <div className="flex justify-end mb-6">
        <Button 
          variant={isEditing ? 'default' : 'outline'} 
          onClick={() => setIsEditing(!isEditing)}
          className="gap-2"
        >
          {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          {isEditing ? 'Done Editing' : 'Edit Cart'}
        </Button>
      </div>

      {/* Store Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={!selectedStore ? 'default' : 'outline'}
          onClick={() => setSelectedStore(null)}
          className="gap-2"
        >
          <Warehouse className="w-4 h-4" />
          All Stores
          <Badge className="ml-1">
            {cart.items.length}
          </Badge>
        </Button>
        
        {storesInCart.map(store => (
          <Button
            key={store._id}
            variant={selectedStore === store._id ? 'default' : 'outline'}
            onClick={() => toggleStore(store._id)}
            className="gap-2"
          >
            <Store className="w-4 h-4" />
            {store.storeName}
            <Badge className="ml-1">
              {cart.items.filter(item => item.productDetails.storeId === store._id).length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Store Info when selected */}
      {selectedStore && (
        <Card className="mb-6">
          <CardContent className="p-4 flex items-center gap-4">
            <img 
              src={mockStores.find(s => s._id === selectedStore)?.profilePicture} 
              alt="Store" 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold">
                {mockStores.find(s => s._id === selectedStore)?.storeName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mockStores.find(s => s._id === selectedStore)?.city}, {mockStores.find(s => s._id === selectedStore)?.state}
              </p>
              <p className="text-sm mt-1">
                {mockStores.find(s => s._id === selectedStore)?.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <div className="space-y-6">
        {filteredItems.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              {filteredItems.map(item => (
                <div 
                  key={item.productId} 
                  className="flex items-center p-4 border-b last:border-b-0"
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={item.productDetails.image} 
                      alt={item.productDetails.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium">{item.productDetails.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.productDetails.grade} {item.productDetails.category}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.productDetails.weightPerUnit}{item.productDetails.unit} × ₹{item.basePrice}
                    </p>
                    {!selectedStore && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-gray-100">
                        {mockStores.find(s => s._id === item.productDetails.storeId)?.storeName}
                      </span>
                    )}
                  </div>
                  <div className="ml-4 flex items-center">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveProduct(item.productId)}
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
                  ? `No items from ${mockStores.find(s => s._id === selectedStore)?.storeName} in your cart`
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

      {/* Cart Summary */}
      {filteredItems.length > 0 && (
        <Card className="mt-6">
        
            <h1 className='text-2xl font-bold'>
              {selectedStore 
                ? `Order Summary (${mockStores.find(s => s._id === selectedStore)?.storeName})`
                : "Order Summary (All Stores)"}
            </h1>
        
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  ₹{selectedStore 
                    ? calculateStoreTotal(selectedStore).toFixed(2)
                    : grandTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>To be calculated</span>
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
                    {selectedStore ? 'Checkout from this store' : 'Checkout all items'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedStore 
                        ? `Checkout from ${mockStores.find(s => s._id === selectedStore)?.storeName}`
                        : "Checkout All Items"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Order Summary</h4>
                      {filteredItems.map(item => (
                        <div key={item.productId} className="flex justify-between py-2">
                          <span>
                            {item.productDetails.name} × {item.quantity}
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
                      Confirm Order
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ShoppingCartUI;