import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface QuoteTargetProduct {
  id?: string;
  name: string;
  slug?: string;
}

interface QuoteModalContextType {
  isOpen: boolean;
  targetProduct: QuoteTargetProduct | null;
  sourcePage: string;
  openQuoteModal: (product?: QuoteTargetProduct | null, source?: string) => void;
  closeQuoteModal: () => void;
}

const QuoteModalContext = createContext<QuoteModalContextType | undefined>(undefined);

export const QuoteModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetProduct, setTargetProduct] = useState<QuoteTargetProduct | null>(null);
  const [sourcePage, setSourcePage] = useState('homepage');

  const openQuoteModal = (product?: QuoteTargetProduct | null, source = 'homepage') => {
    setTargetProduct(product || null);
    setSourcePage(source);
    setIsOpen(true);
  };

  const closeQuoteModal = () => {
    setIsOpen(false);
  };

  return (
    <QuoteModalContext.Provider
      value={{
        isOpen,
        targetProduct,
        sourcePage,
        openQuoteModal,
        closeQuoteModal
      }}
    >
      {children}
    </QuoteModalContext.Provider>
  );
};

export const useQuoteModal = () => {
  const context = useContext(QuoteModalContext);
  if (!context) {
    throw new Error('useQuoteModal must be used within a QuoteModalProvider');
  }
  return context;
};
