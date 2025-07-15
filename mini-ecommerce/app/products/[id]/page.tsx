'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { api } from '@/lib/api';
import { useCart } from '../../components/CartProvider';
import { Star, ShoppingCart, ArrowLeft, Loader2, Plus, Minus } from 'lucide-react';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                const productData = await api.getProduct(Number(params.id));
                setProduct(productData);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const handleAddToCart = async () => {
        if (!product) return;

        setAdding(true);
        // Simulate loading for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        addItem(product, quantity);
        setAdding(false);

        // Show success message (in a real app, you'd use a toast)
        alert(`Added ${quantity} ${product.title} to cart!`);
    };

    const updateQuantity = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading product...</span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
                <button
                    onClick={() => router.back()}
                    className="text-blue-600 hover:text-blue-800"
                >
                    ← Go back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Back button */}
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft size={20} className="mr-2" />
                Back to products
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="aspect-w-1 aspect-h-1">
                    <Image
                        src={product.image}
                        alt={product.title}
                        width={600}
                        height={600}
                        className="w-full h-96 lg:h-full object-cover object-center rounded-lg"
                    />
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {product.title}
                        </h1>

                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center">
                                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                                <span className="ml-1 text-gray-600">
                                    {product.rating.rate} ({product.rating.count} reviews)
                                </span>
                            </div>

                            <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
                                {product.category}
                            </span>
                        </div>

                        <p className="text-4xl font-bold text-gray-900 mb-6">
                            ${product.price.toFixed(2)}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Quantity and Add to Cart */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity
                            </label>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => updateQuantity(quantity - 1)}
                                    disabled={quantity <= 1}
                                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Minus size={16} />
                                </button>

                                <span className="text-xl font-semibold w-12 text-center">
                                    {quantity}
                                </span>

                                <button
                                    onClick={() => updateQuantity(quantity + 1)}
                                    disabled={quantity >= 10}
                                    className="p-2 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={adding}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            {adding ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <ShoppingCart size={20} />
                            )}
                            <span>
                                {adding ? 'Adding to Cart...' : `Add ${quantity} to Cart`}
                            </span>
                        </button>

                        <div className="text-center">
                            <span className="text-2xl font-bold text-green-600">
                                Total: ${(product.price * quantity).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Product Features */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li>• Free shipping on orders over $50</li>
                            <li>• 30-day return policy</li>
                            <li>• 1-year warranty included</li>
                            <li>• Secure payment processing</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}