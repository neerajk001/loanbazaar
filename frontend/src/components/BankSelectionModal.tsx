'use client';
import React, { useState } from 'react';
import { X, Building2, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Bank {
    id: string;
    name: string;
    interestRate: string;
    // Reduced data for minimal view, but keeping interface ready if needed
    processingFee?: string;
    processingTime?: string;
}

interface BankSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    productType: string;
    productTitle: string;
    applyHref: string;
}

const BankSelectionModal: React.FC<BankSelectionModalProps> = ({
    isOpen,
    onClose,
    productType,
    productTitle,
    applyHref,
}) => {
    const router = useRouter();

    const banks: Bank[] = [
        { id: 'hdfc', name: 'HDFC Bank', interestRate: '8.50%' },
        { id: 'sbi', name: 'State Bank of India', interestRate: '8.25%' },
        { id: 'icici', name: 'ICICI Bank', interestRate: '8.75%' },
        { id: 'axis', name: 'Axis Bank', interestRate: '9.00%' },
        { id: 'kotak', name: 'Kotak Mahindra Bank', interestRate: '8.90%' },
    ];

    const handleSelect = (bankId: string) => {
        // Immediate navigation on selection for a faster "pop up" feel
        router.push(`${applyHref}&bank=${bankId}`);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200">

                {/* Minimal Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Select Partner Bank</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Minimal List */}
                <div className="flex-1 overflow-y-auto p-2">
                    <div className="space-y-1">
                        {banks.map((bank) => (
                            <button
                                key={bank.id}
                                onClick={() => handleSelect(bank.id)}
                                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{bank.name}</h3>
                                        <p className="text-xs text-gray-500 font-medium">
                                            Rate: <span className="text-green-600">{bank.interestRate}</span>
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Minimal Footer Info */}
                <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                    <p className="text-[10px] text-gray-400">
                        Applying for {productTitle}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default BankSelectionModal;
