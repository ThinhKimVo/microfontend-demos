declare module 'reactRemote/ProductList' {
  const ProductList: React.ComponentType<{
    onProductClick?: (productId: string) => void;
  }>;
  export default ProductList;
}

declare module 'reactRemote/CartWidget' {
  const CartWidget: React.ComponentType<{
    items?: Array<{ id: string; name: string; price: number }>;
  }>;
  export default CartWidget;
}

declare module 'vueRemote/mount' {
  const mount: (el: HTMLElement) => { unmount: () => void };
  export default mount;
}

declare module 'vueRemote/Dashboard' {
  const Dashboard: any;
  export default Dashboard;
}

declare module 'angularRemote/mount' {
  const mount: (el: HTMLElement) => Promise<{ destroy: () => void }>;
  export default mount;
}

declare module 'angularRemote/SettingsModule' {
  const SettingsModule: any;
  export default SettingsModule;
}

declare module 'hopefullAdapter/mount' {
  interface MountOptions {
    initialPath?: string;
  }
  const mount: (el: HTMLElement, options?: MountOptions) => { unmount: () => void };
  export default mount;
}

declare module 'hopefullAdapter/Dashboard' {
  const Dashboard: React.ComponentType;
  export default Dashboard;
}

declare module 'hopefullAdapter/UsersList' {
  const UsersList: React.ComponentType;
  export default UsersList;
}
