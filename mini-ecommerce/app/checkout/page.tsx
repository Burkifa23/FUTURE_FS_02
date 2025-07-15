'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';
import { useCart } from '@/app/components/CartProvider';
import { mockApi } from '@/lib/api';
import { CreditCard, Lock, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
    const { user } = useAuth();
    const { items, getTotal, clearCart } = useCart();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Shipping info
        name: user?.name || '',
        email: user?.email || '',
        address: '',
        city: '',
        zipCode: '',
        country: 'United States',

        // Payment info
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Redirect if not logged in or cart is empty
    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (items.length === 0) {
            router.push('/cart');
        }
    }, [user, items, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Shipping validation
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';

        // Payment validation
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
        if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
        if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
        if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';

        // Basic format validation
        if (formData.cardNumber && formData.cardNumber.replace(/\s/g, '').length !== 16) {
            newErrors.cardNumber = 'Card number must be 16 digits';
        }
        if (formData.cvv && formData.cvv.length !== 3) {
            newErrors.cvv = 'CVV must be 3 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Create order
            const order = await mockApi.createOrder({
                userId: user!.id,
                items,
                total: subtotal + shipping + tax,
                status: 'processing',
                shippingAddress: {
                    name: formData.name,
                    address: formData.address,
                    city: formData.city,
                    zipCode: formData.zipCode,
                    country: formData.country
                }
            });

            // Clear cart
            clearCart();

            // Redirect to success page
            router.push(`/orders?success=${order.id}`);
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An error occurred during checkout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user || items.length === 0) {
        return null;
    }

    const subtotal = getTotal();
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Checkout Form */}
                <div className="space-y-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Shipping Information */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.city ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ZIP Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.zipCode ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center mb-4">
                                <CreditCard className="h-6 w-6 text-gray-600 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                                <Lock className="h-4 w-4 text-green-600 ml-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Card Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.cardNumber && <p className="text-red-600 text-sm mt-1">{errors.cardNumber}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Expiry Date *
                                    </label>
                                    <input
                                        type="text"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleInputChange}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.expiryDate && <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CVV *
                                    </label>
                                    <input
                                        type="text"
                                        name="cvv"
                                        value={formData.cvv}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        maxLength={3}
                                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.cvv ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.cvv && <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cardholder Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="cardName"
                                        value={formData.cardName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.cardName ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.cardName && <p className="text-red-600 text-sm mt-1">{errors.cardName}</p>}
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                                <p className="flex items-center">
                                    <Lock className="h-4 w-4 mr-2" />
                                    Your payment information is secure and encrypted
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-4 px-6 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg font-semibold"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={24} className="animate-spin mr-2" />
                                    Processing Order...
                                </>
                            ) : (
                                `Complete Order - ${total.toFixed(2)}`
                            )}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:sticky lg:top-4">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                        {/* Order Items */}
                        <div className="space-y-4 mb-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {item.product.title}
                                        </p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Totals */}
                        <div className="space-y-3 border-t pt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">
                                    {shipping === 0 ? 'Free' : `${shipping.toFixed(2)}`}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium">${tax.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-lg font-semibold border-t pt-3">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-md">
                            <div className="flex items-start">
                                <Lock className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium">Secure Checkout</p>
                                    <p>Your payment details are protected with 256-bit SSL encryption.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}