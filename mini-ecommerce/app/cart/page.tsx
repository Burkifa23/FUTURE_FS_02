'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../components/CartProvider';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
    const { items, updateQuantity, removeItem, getTotal, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add some products to get started!</p>
                <Link
                    href="/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 flex items-center space-x-2"
                >
                    <Trash2 size={20} />
                    <span>Clear Cart</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center space-x-4">
                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                    <Image
                                        src={item.product.image}
                                        alt={item.product.title}
                                        width={80}
                                        height={80}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/products/${item.product.id}`}
                                        className="text-lg font-medium text-gray-900 hover:text-blue-600 block"
                                    >
                                        {item.product.title}
                                    </Link>
                                    <p className="text-sm text-gray-500 capitalize">
                                        {item.product.category}
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 mt-1">
                                        ${item.product.price.toFixed(2)}
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                                    >
                                        <Minus size={16} />
                                    </button>

                                    <span className="text-lg font-semibold w-8 text-center">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {/* Item Total */}
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-900">
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-600 hover:text-red-800 text-sm mt-1"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold">${getTotal().toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-semibold">
                                    {getTotal() > 50 ? 'Free' : '$9.99'}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-semibold">
                                    ${(getTotal() * 0.08).toFixed(2)}
                                </span>
                            </div>

                            <div className="border-t pt-3">
                                <div className="flex justify-between">
                                    <span className="text-lg font-semibold">Total</span>
                                    <span className="text-lg font-semibold">
                                        ${(getTotal() + (getTotal() > 50 ? 0 : 9.99) + (getTotal() * 0.08)).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {getTotal() < 50 && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-md">
                                <p className="text-sm text-blue-800">
                                    Add ${(50 - getTotal()).toFixed(2)} more for free shipping!
                                </p>
                            </div>
                        )}

                        <div className="mt-6 space-y-3">
                            <Link
                                href="/checkout"
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block"
                            >
                                Proceed to Checkout
                            </Link>

                            <Link
                                href="/"
                                className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors text-center block"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}