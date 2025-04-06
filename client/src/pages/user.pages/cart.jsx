import { useState } from 'react';
import Card from '@/components/ui/card';
import CardContent from '@/components/ui/card-content';
import Button from '@/components/ui/button';
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
  ArrowLeft
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dailog";
import { useNavigate } from 'react-router-dom';

const stores = [
  { id: '1', name: 'ElectroMart' },
  { id: '2', name: 'FashionHub' },
  { id: '3', name: 'HomeEssentials' },
];

const initialProducts = [
  { id: '1', name: 'Smartphone', price: 699, quantity: 1, storeId: '1', storeName: 'ElectroMart', image: 'https://via.placeholder.com/80?text=Product' },
  { id: '2', name: 'Laptop', price: 999, quantity: 1, storeId: '1', storeName: 'ElectroMart', image: 'https://via.placeholder.com/80?text=Product' },
  { id: '3', name: 'T-Shirt', price: 29, quantity: 2, storeId: '2', storeName: 'FashionHub', image: 'https://via.placeholder.com/80?text=Product' },
  { id: '4', name: 'Jeans', price: 59, quantity: 1, storeId: '2', storeName: 'FashionHub', image: 'https://via.placeholder.com/80?text=Product' },
  { id: '5', name: 'Pillow', price: 19, quantity: 3, storeId: '3', storeName: 'HomeEssentials', image: 'https://via.placeholder.com/80?text=Product' },
];

const ShoppingCartUI = () => {
  const [products, setProducts] = useState(initialProducts);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const navigate = useNavigate();

  const filteredProducts = selectedStore
    ? products.filter(product => product.storeId === selectedStore)
    : products;

  const productsByStore = stores.map(store => {
    const storeProducts = products.filter(product => product.storeId === store.id);
    return {
      ...store,
      products: storeProducts,
      total: storeProducts.reduce((sum, product) => sum + product.price * product.quantity, 0)
    };
  });

  const grandTotal = products.reduce(
    (sum, product) => sum + product.price * product.quantity, 
    0
  );

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setProducts(products.map(product =>
      product.id === id ? { ...product, quantity: newQuantity } : product
    ));
  };

  const handleRemoveProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const toggleStore = (storeId) => {
    setSelectedStore(selectedStore === storeId ? null : storeId);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShoppingCart className="w-8 h-8" />
          Your Shopping Cart
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
      <div className="flex flex-wrap gap-3 mb-8">
        {stores.map(store => (
          <Button
            key={store.id}
            variant={selectedStore === store.id ? 'default' : 'outline'}
            onClick={() => toggleStore(store.id)}
            className="gap-2"
          >
            <Store className="w-4 h-4" />
            {store.name}
            <Badge className="ml-1">
              {products.filter(p => p.storeId === store.id).length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Products List */}
      <div className="space-y-8">
        {productsByStore
          .filter(store => store.products.length > 0)
          .filter(store => !selectedStore || store.id === selectedStore)
          .map(store => (
            <div key={store.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-gray-800"></span>
                  {store.name}
                </h2>
                <p className="text-sm font-medium">
                  Store Total: <span className="text-lg font-bold">${store.total.toFixed(2)}</span>
                </p>
              </div>

              <Card>
                <CardContent className="p-0 divide-y">
                  {store.products.map(product => (
                    <div 
                      key={product.id} 
                      className="flex items-center p-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-5 flex-grow">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600">
                          ${product.price.toFixed(2)} each
                        </p>
                        {!isEditing && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs rounded-md bg-gray-100">
                            {product.storeName}
                          </span>
                        )}
                      </div>
                      <div className="ml-4 flex items-center">
                        {isEditing ? (
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-9 w-9"
                              onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={product.quantity}
                              onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                              min="1"
                            />
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-9 w-9"
                              onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => handleRemoveProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ${(product.price * product.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {product.quantity} {product.quantity > 1 ? 'items' : 'item'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
      </div>

      {/* Cart Summary */}
      {products.length > 0 && (
        <Card className="mt-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span>Subtotal</span>
                <span className="font-medium">${grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span>Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold">${grandTotal.toFixed(2)}</span>
              </div>
              <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full mt-6 py-6 text-lg font-bold"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Checkout</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold text-lg mb-2">Order Summary</h3>
                      {productsByStore
                        .filter(store => store.products.length > 0)
                        .map(store => (
                          <div key={store.id} className="mb-3 last:mb-0">
                            <h4 className="font-medium flex items-center">
                              <span className="w-2 h-2 rounded-full mr-2 bg-gray-800"></span>
                              {store.name}: ${store.total.toFixed(2)}
                            </h4>
                          </div>
                        ))}
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                    <Button className="w-full mt-4" size="lg">
                      Confirm Purchase
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-6">
            <ShoppingCart className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button 
            className="px-8 py-4 text-lg"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </div>
  );
}

export default ShoppingCartUI;