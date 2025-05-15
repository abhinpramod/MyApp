import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../lib/axios';

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transportationCharge, setTransportationCharge] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(`/orders`);
        // Find the specific order by orderId from the array
        const foundOrder = response.data.orders.find(o => o._id === orderId);
        
        if (!foundOrder) {
          throw new Error('Order not found');
        }
        
        setOrder(foundOrder);
        setTransportationCharge(foundOrder.transportationCharge || 0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error(error.message || 'Failed to load order details');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleUpdateTransportation = async () => {
    if (isNaN(transportationCharge) || transportationCharge < 0) {
      toast.error('Please enter a valid transportation charge');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await axiosInstance.patch(`/orders/${orderId}/transportation`, {
        transportationCharge: Number(transportationCharge)
      });
      setOrder(response.data.order);
      toast.success('Transportation charge updated successfully');
    } catch (error) {
      console.error('Error updating transportation:', error);
      toast.error(error.response?.data?.message || 'Failed to update transportation charge');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Order Header */}
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium">Order Details</h3>
                <p className="mt-1 max-w-2xl text-sm text-blue-100">Order ID: {order._id}</p>
              </div>
              <div className="bg-white text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {order.status?.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {/* Order Summary */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Order Summary</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quantity</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {order.items?.map((item, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img className="h-10 w-10 rounded-md object-cover" src={item.productDetails.image} alt={item.productDetails.name} />
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">{item.productDetails.name}</div>
                                  <div className="text-gray-500">{item.productDetails.weightPerUnit} {item.productDetails.unit}/unit</div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.quantity}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">₹{item.price}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">₹{item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <th scope="row" colSpan="3" className="hidden pl-6 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-6">Subtotal</th>
                          <th scope="row" className="pl-4 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">Subtotal</th>
                          <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-6">₹{order.subtotal}</td>
                        </tr>
                        <tr>
                          <th scope="row" colSpan="3" className="hidden pl-6 pr-3 pt-2 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-6">Transportation</th>
                          <th scope="row" className="pl-4 pr-3 pt-2 text-left text-sm font-semibold text-gray-900 sm:hidden">Transportation</th>
                          <td className="pl-3 pr-4 pt-2 text-right text-sm font-semibold text-gray-900 sm:pr-6">
                            <div className="flex items-center justify-end space-x-2">
                              <input
                                type="number"
                                min="0"
                                value={transportationCharge}
                                onChange={(e) => setTransportationCharge(e.target.value)}
                                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-right"
                              />
                              <button
                                onClick={handleUpdateTransportation}
                                disabled={isUpdating}
                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                              >
                                {isUpdating ? 'Updating...' : 'Update'}
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row" colSpan="3" className="hidden pl-6 pr-3 pt-2 pb-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-6">Total</th>
                          <th scope="row" className="pl-4 pr-3 pt-2 pb-4 text-left text-sm font-semibold text-gray-900 sm:hidden">Total</th>
                          <td className="pl-3 pr-4 pt-2 pb-4 text-right text-sm font-semibold text-blue-600 sm:pr-6">₹{order.totalAmount}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </dd>
              </div>

              {/* Payment Information */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Payment Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Payment Method</p>
                      <p className="capitalize">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="font-medium">Payment Status</p>
                      <p className="capitalize">{order.paymentStatus}</p>
                    </div>
                    <div>
                      <p className="font-medium">Order Date</p>
                      <p>{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </dd>
              </div>

              {/* Customer Information */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Customer Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Name</p>
                      <p>{order.userDetails?.name}</p>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p>{order.userDetails?.email}</p>
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p>{order.userDetails?.phoneNumber}</p>
                    </div>
                  </div>
                </dd>
              </div>

              {/* Shipping Information */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Shipping Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Address</p>
                      <p>
                        {order.shippingInfo?.address.buildingAddress},<br />
                        {order.shippingInfo?.address?.landmark && `${order.shippingInfo?.address?.landmark},`}<br />
                        {order.shippingInfo?.address.city}, {order.shippingInfo?.address.state}<br />
                        {order.shippingInfo?.address.pincode}, {order.shippingInfo?.address.country}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Contact Number</p>
                      <p>{order.shippingInfo?.phoneNumber}</p>
                    </div>
                  </div>
                </dd>
              </div>

              {/* Store Information */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Store Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Store Name</p>
                      <p>{order.storeDetails?.storeName}</p>
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <p>{order.storeDetails?.city}, {order.storeDetails?.state}</p>
                    </div>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;