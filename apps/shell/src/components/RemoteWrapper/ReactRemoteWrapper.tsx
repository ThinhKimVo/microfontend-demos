import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './ErrorBoundary';

const ProductList = lazy(() => import('reactRemote/ProductList'));
const CartWidget = lazy(() => import('reactRemote/CartWidget'));

const Loading: React.FC = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
  </div>
);

export const ReactProductList: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <ProductList />
      </Suspense>
    </ErrorBoundary>
  );
};

export const ReactCartWidget: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <CartWidget />
      </Suspense>
    </ErrorBoundary>
  );
};

const ReactRemoteWrapper: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Catalog</h2>
        <ReactProductList />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Shopping Cart</h2>
        <ReactCartWidget />
      </div>
    </div>
  );
};

export default ReactRemoteWrapper;
