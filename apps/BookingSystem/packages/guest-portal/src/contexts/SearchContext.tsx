import React, { createContext, useContext, useState, useCallback } from 'react';
import { Property, PropertyType } from '@staygcc/shared/types';
import { mockProperties } from '@staygcc/shared/mock-data';

interface SearchFilters {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  propertyType: PropertyType | null;
  priceMin: number;
  priceMax: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  instantBook: boolean;
}

interface SearchContextType {
  filters: SearchFilters;
  results: Property[];
  isLoading: boolean;
  totalResults: number;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  search: () => Promise<void>;
}

const defaultFilters: SearchFilters = {
  location: '',
  checkIn: null,
  checkOut: null,
  guests: 1,
  propertyType: null,
  priceMin: 0,
  priceMax: 10000,
  bedrooms: 0,
  bathrooms: 0,
  amenities: [],
  instantBook: false,
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFiltersState] = useState<SearchFilters>(defaultFilters);
  const [results, setResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const setFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  const search = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Filter mock properties based on filters
      let filtered = [...mockProperties];

      if (filters.location) {
        const searchTerm = filters.location.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.location.city.toLowerCase().includes(searchTerm) ||
            p.location.country.toLowerCase().includes(searchTerm) ||
            p.titleEn.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.propertyType) {
        filtered = filtered.filter((p) => p.propertyType === filters.propertyType);
      }

      if (filters.priceMin > 0) {
        filtered = filtered.filter((p) => p.pricing.basePrice >= filters.priceMin);
      }

      if (filters.priceMax < 10000) {
        filtered = filtered.filter((p) => p.pricing.basePrice <= filters.priceMax);
      }

      if (filters.bedrooms > 0) {
        filtered = filtered.filter((p) => p.bedrooms >= filters.bedrooms);
      }

      if (filters.bathrooms > 0) {
        filtered = filtered.filter((p) => p.bathrooms >= filters.bathrooms);
      }

      if (filters.guests > 1) {
        filtered = filtered.filter((p) => p.maxGuests >= filters.guests);
      }

      if (filters.instantBook) {
        filtered = filtered.filter((p) => p.instantBook);
      }

      if (filters.amenities.length > 0) {
        filtered = filtered.filter((p) =>
          filters.amenities.every((amenity) =>
            Object.entries(p.amenities).some(([key, value]) => key === amenity && value)
          )
        );
      }

      setResults(filtered);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const value: SearchContextType = {
    filters,
    results,
    isLoading,
    totalResults: results.length,
    setFilters,
    resetFilters,
    search,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export default SearchContext;
