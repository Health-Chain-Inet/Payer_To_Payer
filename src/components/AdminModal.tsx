import React from 'react';
import { X, User, Building, Mail, Phone } from 'lucide-react';

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    payer: {
        payer_name: string;
        adm_email: string;
        adm_name?: string;
        adm_phone?: string;
    } | null;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, payer }) => {
    if (!isOpen || !payer) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <div className="inline-block align-bottom bg-white rounded-xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    {/* Header Section */}
                    <div className="absolute top-0 right-0 pt-4 pr-4">
                        <button
                            type="button"
                            className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5 text-gray-500" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="sm:flex sm:items-start">
                        <div className="w-full">
                            <div className="border-b border-gray-200 pb-4 mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Administrator Details
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    View detailed information about the administrator
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Payer Name */}
                                <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                    <Building className="h-5 w-5 text-blue-600 mr-3" />
                                    <div>
                                        <label className="block text-sm font-medium text-blue-600">Payer Organization</label>
                                        <p className="mt-1 text-sm font-semibold text-gray-900">{payer.payer_name}</p>
                                    </div>
                                </div>

                                {/* Admin Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Admin Name */}
                                    <div className="flex items-start p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors duration-200">
                                        <User className="h-5 w-5 text-indigo-600 mr-3 mt-1" />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Admin Name</label>
                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {payer.adm_name || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Admin Email */}
                                    <div className="flex items-start p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors duration-200">
                                        <Mail className="h-5 w-5 text-indigo-600 mr-3 mt-1" />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Email Address</label>
                                            <p className="mt-1 text-sm font-medium text-gray-900">{payer.adm_email}</p>
                                        </div>
                                    </div>

                                    {/* Admin Phone */}
                                    <div className="flex items-start p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors duration-200 md:col-span-2">
                                        <Phone className="h-5 w-5 text-indigo-600 mr-3 mt-1" />
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                {payer.adm_phone || 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
