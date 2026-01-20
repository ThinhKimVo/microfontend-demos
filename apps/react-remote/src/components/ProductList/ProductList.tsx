import React, { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 249.99,
    image: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=Watch',
    description: 'Feature-rich smartwatch with health tracking',
  },
  {
    id: '3',
    name: 'Laptop Stand',
    price: 49.99,
    image: 'https://via.placeholder.com/200x200/8B5CF6/FFFFFF?text=Stand',
    description: 'Ergonomic aluminum laptop stand',
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    price: 129.99,
    image: 'https://via.placeholder.com/200x200/EF4444/FFFFFF?text=Keyboard',
    description: 'RGB mechanical keyboard with Cherry MX switches',
  },
];

interface ProductListProps {
  onProductClick?: (productId: string) => void;
}

export default function ProductList({ onProductClick }: ProductListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClick = (productId: string) => {
    setSelectedId(productId);
    onProductClick?.(productId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 text-balance">Products</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => handleClick(product.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick(product.id);
              }
            }}
            role="button"
            tabIndex={0}
            aria-pressed={selectedId === product.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedId === product.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <h3 className="font-medium text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-blue-600">
                ${product.price}
              </span>
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
