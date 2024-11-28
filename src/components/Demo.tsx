import React from 'react';
import { useForm } from 'react-hook-form';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const StepTimeline: React.FC<{ activeStep: 'upload' | 'create' }> = ({ activeStep }) => {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between relative">
                {/* Upload Step */}
                <div className={`flex-1 text-center`}>
                    <span className={`block w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center mb-2 
                        ${activeStep === 'upload' ? 'bg-indigo-600 text-white' : 'bg-white border-indigo-600 text-indigo-600'}`}>
                        1
                    </span>
                    Organization Details
                </div>

                {/* Line connecting the steps */}
                <div className={`absolute top-1/2 left-0 right-0 h-1 bg-gray-300`}>
                    <div className={`h-full bg-indigo-600 transition-all ease-in-out duration-300 ${activeStep === 'upload' ? 'w-1/2' : 'w-full'}`} />
                </div>

                {/* Create Step */}
                <div className={`flex-1 text-center`}>
                    <span className={`block w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center mb-2 
                        ${activeStep === 'create' ? 'bg-indigo-600 text-white' : 'bg-white border-indigo-600 text-indigo-600'}`}>
                        2
                    </span>
                    Administration Details
                </div>
                <div className={`flex-1 text-center`}>
                    <span className={`w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center mb-2 
                        ${activeStep === 'create' ? 'bg-indigo-600 text-white' : 'bg-white border-indigo-600 text-indigo-600'}`}>
                        3
                    </span>
                    Review and Confirm
                </div>
            </div>
        </div>
    );
};

const RegisterPage: React.FC = () => {
    const { register: registerUpload, handleSubmit: handleSubmitUpload, formState: { errors: uploadErrors } } = useForm();
    const { register: registerCreate, handleSubmit: handleSubmitCreate, formState: { errors: createErrors } } = useForm();
    const [uploading, setUploading] = React.useState<boolean>(false);
    const [activeTab, setActiveTab] = React.useState<'upload' | 'create'>('upload');

    const onUploadSubmit = (data: any) => {
        setUploading(true);
        console.log(data);
        setTimeout(() => {
            setUploading(false);
        }, 2000);
    };

    const onCreateSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
                {/* Step Timeline */}
                <StepTimeline activeStep={activeTab} />

                <div className="flex space-x-4 mb-4">
                    <button
                        className={`flex-1 py-2 text-center ${activeTab === 'upload' ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        Upload
                    </button>
                    <button
                        className={`flex-1 py-2 text-center ${activeTab === 'create' ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
                        onClick={() => setActiveTab('create')}
                    >
                        Create
                    </button>
                </div>

                {activeTab === 'upload' && (
                    <form onSubmit={handleSubmitUpload(onUploadSubmit)}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Public Certificate (PEM format)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                                <span>Upload a file</span>
                                                <input
                                                    {...registerUpload('certificate', { required: true })}
                                                    type="file"
                                                    className="sr-only"
                                                    accept=".pem,.crt,.cer"
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">PEM, CRT, or CER up to 5MB</p>
                                    </div>
                                </div>
                            </div>

                            {uploadErrors.certificate && (
                                <div className="flex items-center text-red-500 text-sm">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Certificate is required
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                            >
                                {uploading ? (
                                    <>
                                        <Upload className="animate-spin h-5 w-5 mr-2" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        Upload Certificate
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {activeTab === 'create' && (
                    <form onSubmit={handleSubmitCreate(onCreateSubmit)}>
                        <div className="space-y-8">
                            {/* Organization Details Section */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Organization Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                                        <input
                                            {...registerCreate('organizationName', { required: true })}
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        {createErrors.organizationName && (
                                            <p className="text-red-500 text-sm">Organization Name is required</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Organization Type</label>
                                        <input
                                            {...registerCreate('organizationType', { required: true })}
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                        {createErrors.organizationType && (
                                            <p className="text-red-500 text-sm">Organization Type is required</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Organization Phone Number</label>
                                        <input
                                            {...registerCreate('phoneNumber', { required: true })}
                                            type="tel"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                        {createErrors.phoneNumber && (
                                            <p className="text-red-500 text-sm">Phone Number is required</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Username</label>
                                        <input
                                            {...registerCreate('username', { required: true })}
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                        {createErrors.username && (
                                            <p className="text-red-500 text-sm">Username is required</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Address Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                                        <input
                                            {...registerCreate('addressLine1', { required: true })}
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                        {createErrors.addressLine1 && (
                                            <p className="text-red-500 text-sm">Address Line 1 is required</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                                        <input
                                            {...registerCreate('addressLine2')}
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City</label>
                                        <input
                                            {...registerCreate('city', { required: true })}
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                        {createErrors.city && (
                                            <p className="text-red-500 text-sm">City is required</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">State</label>
                                        <input
                                            {...registerCreate('state', { required: true })}
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                        {createErrors.state && (
                                            <p className="text-red-500 text-sm">State is required</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                        <input
                                            {...registerCreate('country', { required: true })}
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                        {createErrors.country && (
                                            <p className="text-red-500 text-sm">Country is required</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                                        <input
                                            {...registerCreate('zipCode', { required: true })}
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                        {createErrors.zipCode && (
                                            <p className="text-red-500 text-sm">Zip Code is required</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Submit and Back Buttons */}
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('upload')}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Back to Upload
                                </button>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;
