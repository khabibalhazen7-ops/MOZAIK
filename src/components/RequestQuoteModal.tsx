import React from 'react';
import { X } from 'lucide-react';
import { useQuoteModal } from '../context/QuoteModalContext';
import { QuoteForm } from './QuoteForm';

export const RequestQuoteModal: React.FC = () => {
  const { isOpen, targetProduct, sourcePage, closeQuoteModal } = useQuoteModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1A18]/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-[#E5DFD5] shadow-2xl p-6 sm:p-10 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5]">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#8C7A6B] font-semibold block">
              MOZAIK QUARRY DIRECT
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2C2926] mt-0.5">
              Request a Project Quotation
            </h2>
          </div>
          <button
            onClick={closeQuoteModal}
            className="p-1.5 text-[#7B756C] hover:text-[#2C2926] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Embedded Quote Form */}
        <QuoteForm
          initialProduct={targetProduct}
          sourcePage={sourcePage}
          isModal={true}
        />
      </div>
    </div>
  );
};
