'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { useCart } from './CartProvider';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';

export default function Header() {
    const { user, logout } = useAuth();
    const { getItemCount } = useCart();

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-gray-900">
                        ShopMini
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className="text-gray-600 hover:text-gray-900">
                            Products
                        </Link>
                        {user && (
                            <Link href="/orders" className="text-gray-600 hover:text-gray-900">
                                Orders
                            </Link>
                        )}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Cart */}
                        <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900">
                            <ShoppingCart size={24} />
                            {getItemCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {getItemCount()}
                                </span>
                            )}
                        </Link>

                        {/* User menu */}
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-600 hidden sm:block">Hi, {user.name}</span>
                                <button
                                    onClick={logout}
                                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                                >
                                    <LogOut size={20} />
                                    <span className="hidden sm:block">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                            >
                                <User size={20} />
                                <span className="hidden sm:block">Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile navigation */}
            <div className="md:hidden border-t">
                <nav className="flex justify-around py-2">
                    <Link href="/" className="flex items-center space-x-1 text-gray-600">
                        <Package size={20} />
                        <span>Products</span>
                    </Link>
                    {user && (
                        <Link href="/orders" className="flex items-center space-x-1 text-gray-600">
                            <Package size={20} />
                            <span>Orders</span>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}