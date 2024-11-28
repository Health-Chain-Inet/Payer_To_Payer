import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CertificateUploadPage: React.FC<{ initialStep?: 'organization' | 'administration' | 'review' }> = ({ initialStep = 'organization' }) => {
    const [certificate, setCertificate] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [activeStep, setActiveStep] = React.useState<'organization' | 'administration' | 'review'>(initialStep);
    const navigate = useNavigate();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setCertificate(event.target.files[0]);
        } else {
            setCertificate(null);
        }
    };

    const [formData, setFormData] = useState({
        endpointUrl: '',
        payerName: ''
    });

    const [formErrors, setFormErrors] = useState({
        endpointUrl: '',
        payerName: ''
    });


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!certificate) return;

        try {
            setUploading(true);
            navigate('/directory');
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    }

    const validateEndpointUrl = (url: string) => {
        if (!url.trim()) {
            return 'Endpoint URL is required';
        }
        if (url.length < 5) {
            return 'Endpoint URL must be at least 5 characters';
        }
        return '';
    };


    const validatePayerName = (name: string) => {
        if (!name.trim()) {
            return 'Payer name is required';
        }
        if (name.length < 2) {
            return 'Payer name must be at least 2 characters';
        }
        return '';
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: '' }));
    };



    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white shadow-[0_8px_50px_rgb(0,0,0,0.12)] rounded-xl p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Certificate Upload
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">
                                Public Certificate (PEM format)
                            </label>
                            <div className="mt-2 flex justify-center px-8 py-8 border-2 border-gray-300 border-dashed rounded-lg">
                                <div className="space-y-3 text-center">
                                    <Upload className="mx-auto h-16 w-16 text-gray-400" />
                                    <div className="flex flex-col text-sm text-gray-600">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                            <span className="text-lg">Upload a file</span>
                                            <input
                                                type="file"
                                                className="sr-only"
                                                accept=".pem,.crt,.cer"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Drag and drop or click to select
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-500">PEM, CRT, or CER up to 5MB</p>
                                </div>
                            </div>
                        </div>

                        {certificate === null && (
                            <div className="flex items-center text-red-500 text-sm mt-4">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                Certificate is required
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 mt-6"
                        >
                            {uploading ? (
                                <>
                                    <Upload className="animate-spin h-6 w-6 mr-3" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-6 w-6 mr-3" />
                                    Upload Certificate
                                </>
                            )}
                        </button>
                    </div>


                    {/* Payer Endpoint URL Section */}
                    <div className="mt-6">
                        <label className="block text-lg font-medium text-gray-700">
                            Payer Endpoint URL/Base URL
                        </label>
                        <input
                            type="text"
                            name="endpointUrl"
                            value={formData.endpointUrl}
                            onChange={handleInputChange}
                            onBlur={(e) => setFormErrors(prev => ({
                                ...prev,
                                endpointUrl: validateEndpointUrl(e.target.value)
                            }))}
                            className={`mt-2 block w-full border ${formErrors.endpointUrl ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base`}
                            placeholder="Enter Payer Endpoint/Base URL"
                            required
                        />
                        {formErrors.endpointUrl && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.endpointUrl}</p>
                        )}

                        <label className="block text-lg font-medium text-gray-700 mt-4">
                            Payer Name
                        </label>
                        <input
                            type="text"
                            name="payerName"
                            value={formData.payerName}
                            onChange={handleInputChange}
                            onBlur={(e) => setFormErrors(prev => ({
                                ...prev,
                                payerName: validatePayerName(e.target.value)
                            }))}
                            className={`mt-2 block w-full border ${formErrors.payerName ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base`}
                            placeholder="Enter Payer Name"
                            required
                        />
                        {formErrors.payerName && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.payerName}</p>
                        )}
                    </div>




                    {/* Next Button */}
                    <div className="mt-8">
                        <button
                            type="button"
                            className="w-1/4 flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            onClick={() => navigate('/register', { state: { initialStep: 'administration' } })}
                        >
                            Next

                        </button>
                    </div>


                </form>
            </div>
        </div>
    );
};

export default CertificateUploadPage;
