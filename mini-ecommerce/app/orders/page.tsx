'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import { mockApi } from '@/lib/api';
import { Order } from '@/lib/types';
import { Package, CheckCircle, Truck, Clock, Eye } from 'lucide-react';

export default function OrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const successOrderId = searchParams.get('success');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        async function fetchOrders() {
            try {
                setLoading(true);
                const userOrders = await mockApi.getUserOrders(user.id);
                setOrders(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, [user, router]);

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'processing':
                return <Package className="h-5 w-5 text-blue-500" />;
            case 'shipped':
                return <Truck className="h-5 w-5 text-purple-500" />;
            case 'delivered':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading orders...</span>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Success Message */}
            {successOrderId && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <div>
                            <h3 className="text-sm font-medium text-green-800">Order placed successfully!</h3>
                            <p className="text-sm text-green-600 mt-1">
                                Your order #{successOrderId} has been confirmed and is being processed.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Your Orders</h1>
                <button
                    onClick={() => router.push('/')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Continue Shopping
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <Package size={64} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
                    <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Order #{order.id}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {getStatusIcon(order.status)}
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-gray-900">
                                            ${order.total.toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-1"
                                        >
                                            <Eye size={16} className="mr-1" />
                                            {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items Preview */}
                            <div className="px-6 py-4">
                                <div className="flex items-center space-x-4 overflow-x-auto">
                                    {order.items.slice(0, 3).map((item) => (
                                        <div key={item.id} className="flex-shrink-0 flex items-center space-x-3">
                                            <img
                                                src={item.product.image}
                                                alt={item.product.title}
                                                className="w-12 h-12 object-cover rounded-md"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                                                    {item.product.title}
                                                </p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <div className="flex-shrink-0 text-sm text-gray-500">
                                            +{order.items.length - 3} more item{order.items.length > 4 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Expanded Order Details */}
                            {selectedOrder?.id === order.id && (
                                <div className="border-t bg-gray-50">
                                    <div className="px-6 py-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Items */}
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
                                                <div className="space-y-3">
                                                    {order.items.map((item) => (
                                                        <div key={item.id} className="flex items-center space-x-3">
                                                            <img
                                                                src={item.product.image}
                                                                alt={item.product.title}
                                                                className="w-16 h-16 object-cover rounded-md"
                                                            />
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900">{item.product.title}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    ${item.product.price.toFixed(2)} × {item.quantity}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-medium text-gray-900">
                                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Shipping & Summary */}
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                                                <div className="text-sm text-gray-600 mb-6">
                                                    <p className="font-medium">{order.shippingAddress.name}</p>
                                                    <p>{order.shippingAddress.address}</p>
                                                    <p>
                                                        {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                                                    </p>
                                                    <p>{order.shippingAddress.country}</p>
                                                </div>

                                                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Subtotal</span>
                                                        <span>${(order.total - 9.99 - (order.total - 9.99) * 0.08).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Shipping</span>
                                                        <span>$9.99</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Tax</span>
                                                        <span>${((order.total - 9.99) * 0.08).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                                                        <span>Total</span>
                                                        <span>${order.total.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}