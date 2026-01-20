import React, { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const initialItems: CartItem[] = [
  { id: '1', name: 'Wireless Headphones', price: 99.99, quantity: 1 },
  { id: '2', name: 'Smart Watch', price: 249.99, quantity: 1 },
];

interface CartWidgetProps {
  items?: CartItem[];
}

export default function CartWidget({ items: propItems }: CartWidgetProps) {
  const [items, setItems] = useState<CartItem[]>(propItems || initialItems);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 text-balance">Shopping Cart</h2>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-gray-100 pb-4"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-gray-900">Total</span>
              <span className="text-xl font-bold text-blue-600">
                ${total.toFixed(2)}
              </span>
            </div>
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
