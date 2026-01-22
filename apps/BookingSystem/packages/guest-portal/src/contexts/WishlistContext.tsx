import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface WishlistContextType {
  wishlist: string[];
  isInWishlist: (propertyId: string) => boolean;
  addToWishlist: (propertyId: string) => void;
  removeFromWishlist: (propertyId: string) => void;
  toggleWishlist: (propertyId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'staygcc-wishlist';

const getStoredWishlist = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return [];
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<string[]>(getStoredWishlist);

  // Persist to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = useCallback(
    (propertyId: string) => {
      return wishlist.includes(propertyId);
    },
    [wishlist]
  );

  const addToWishlist = useCallback((propertyId: string) => {
    setWishlist((prev) => {
      if (prev.includes(propertyId)) return prev;
      return [...prev, propertyId];
    });
  }, []);

  const removeFromWishlist = useCallback((propertyId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== propertyId));
  }, []);

  const toggleWishlist = useCallback((propertyId: string) => {
    setWishlist((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      }
      return [...prev, propertyId];
    });
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  const value: WishlistContextType = {
    wishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
