import React from 'react';
import ProductList from './components/ProductList/ProductList';
import CartWidget from './components/Cart/CartWidget';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">React Remote</h1>
          <p className="text-gray-600">
            Standalone mode - Running on port 3101
          </p>
        </header>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProductList />
          </div>
          <div>
            <CartWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
