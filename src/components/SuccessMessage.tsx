import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const SuccessMessage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Successfully Registered!
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        To activate your account, please click on the link sent to your email.
                    </p>
                </div>

                <div className="mt-8">
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessMessage;
