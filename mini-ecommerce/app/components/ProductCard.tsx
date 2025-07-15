
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { useCart } from './CartProvider';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const [error, setError] = useState<string | null>(null);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            addItem(product);
            setError(null);
        } catch (err) {
            setError('Failed to add item to cart. Please try again.');
            console.error('Add to cart error:', err);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/products/${product.id}`}>
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                    <Image
                        src={product.image}
                        alt={product.title}
                        width={300}
                        height={300}
                        className="h-48 w-full object-cover object-center hover:scale-105 transition-transform"
                    />
                </div>

                <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                    </h3>

                    <div className="flex items-center mb-2">
                        <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm text-gray-600">
                                {product.rating.rate} ({product.rating.count})
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                        </span>
                    </div>
                </div>
            </Link>
            <div className="p-4 pt-0">
                <button
                    onClick={handleAddToCart}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 w-full mt-2"
                >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                </button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
        </div>
    );
}