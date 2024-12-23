import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../config/config.js';
import Terms from './Terms.js';

// Type definitions for location state and step types
type StepType = 'payer' | 'terms' | 'review';
interface LocationState {
    initialStep?: StepType;
    certificationData?: {
        certification: string;
        uploaded: boolean;
    }
}

// Timeline component for showing registration progress
const StepTimeline: React.FC<{ activeStep: StepType }> = ({ activeStep }) => {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between relative">
                {/* Payer Details Step */}
                <div className="flex-1 text-center">
                    <span className={`block w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center mb-2 
                        ${activeStep === 'payer' ? 'bg-indigo-600 text-white' : 'bg-white border-indigo-600 text-indigo-600'}`}>
                        1
                    </span>
                    Payer Details
                </div>
                {/* Progress line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300">
                    <div className={`h-full bg-indigo-600 transition-all ease-in-out duration-300 
                        ${activeStep === 'payer' ? 'w-0' : activeStep === 'terms' ? 'w-1/2' : 'w-full'}`} />
                </div>
                {/* Terms Step */}
                <div className="flex-1 text-center">
                    <span className={`block w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center mb-2 
                        ${activeStep === 'terms' ? 'bg-indigo-600 text-white' : 'bg-white border-indigo-600 text-indigo-600'}`}>
                        2
                    </span>
                    Terms & Conditions
                </div>
                {/* Review Step */}
                <div className="flex-1 text-center">
                    <span className={`block w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center mb-2 
                        ${activeStep === 'review' ? 'bg-indigo-600 text-white' : 'bg-white border-indigo-600 text-indigo-600'}`}>
                        3
                    </span>
                    Review and Confirm
                </div>
            </div>
        </div>
    );
};

// Main RegisterPage component
const RegisterPage1: React.FC = () => {
    // Form and navigation hooks
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = location.state as LocationState;

    // State management
    const [activeStep, setActiveStep] = useState<StepType>(locationState?.initialStep || 'payer');
    const [formData, setFormData] = useState<any>({});
    const [confirmmsg, setconfirmmsg] = useState<string>();
    const [isDisabled, setIsDisabled] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // Form submission handlers
    const onSubmitPayer = useCallback((data: any) => {
        setFormData((prev: any) => ({ ...prev, payer: data }));
        setActiveStep('terms');
        console.log(data)
    }, []);

    // API submission handler
    const onSubmitEnrollment = async (e: React.FormEvent) => {
        e.preventDefault();
        setconfirmmsg('Processing submission...');
        setIsDisabled(true);
        console.log(formData.payer)

        try {
            const response = await fetch(`${config.apiUrl}/enroll/enroll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData.payer).toString()
            });
            const data = await response.json();

            if (data.success) {
                navigate('/success');
            } else {
                setconfirmmsg('User already exists');
                setIsDisabled(false);
            }
        } catch (error) {
            setconfirmmsg('Submission failed');
            setIsDisabled(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
                <StepTimeline activeStep={activeStep} />

                {/* Payer Details Form */}
                {activeStep === 'payer' && (
                    <form onSubmit={handleSubmit(onSubmitPayer)}>
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payer Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Organization Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Organization Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register('organization_name', {
                                            required: 'Organization Name is required',
                                            pattern: {
                                                value: /^(?=.*[A-Za-z])[A-Za-z0-9\s]+$/,
                                                message: 'Invalid organization name format'
                                            }
                                        })}
                                        className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 outline-none"                                    />
                                    {errors.organization_name && (
                                        <p className="text-red-500 text-sm">{errors.organization_name.message}</p>
                                    )}
                                </div>

                                {/* Administration Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Administration Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register('admin_name', {
                                            required: 'Administration Name is required',
                                            pattern: {
                                                value: /^[A-Za-z\s]+$/,
                                                message: 'Only letters and spaces allowed'
                                            }
                                        })}
                                        className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 outline-none"                                    />
                                    {errors.admin_name && (
                                        <p className="text-red-500 text-sm">{errors.admin_name.message}</p>
                                    )}
                                </div>

                                {/* Administration Phone Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Administration Phone
                                    </label>
                                    <input
                                        {...register('admin_phone', {
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: 'Enter valid 10-digit phone number'
                                            }
                                        })}
                                        className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 outline-none"
                                    />
                                    {errors.admin_phone && (
                                        <p className="text-red-500 text-sm">{errors.admin_phone.message}</p>
                                    )}
                                </div>

                                {/* Administration Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Administration Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register('admin_email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address'
                                            }
                                        })}
                                        className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 outline-none"
                                    />
                                    {errors.admin_email && (
                                        <p className="text-red-500 text-sm">{errors.admin_email.message}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters'
                                            },
                                            pattern: {
                                                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                                                message: 'Password must contain letter, number, and special character'
                                            }
                                        })}
                                        className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 outline-none"
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm">{errors.password.message}</p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        {...register('confirm_password', {
                                            required: 'Please confirm password',
                                            validate: value => value === watch('password') || 'Passwords do not match'
                                        })}
                                        className="mt-1 block w-full border-2 border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 outline-none"
                                    />
                                    {errors.confirm_password && (
                                        <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* Terms Step */}
                {activeStep === 'terms' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Terms and Conditions</h2>
                        <div className="border border-gray-300 rounded-md p-4 h-64 overflow-y-auto">
                            <span>
                                {/* Terms content */}
                                <Terms />
                            </span>
                        </div>
                        <div className="flex items-start mt-4">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="mt-1 mr-2"
                            />
                            <label className="text-sm text-gray-700">
                                I accept the terms and conditions
                            </label>
                        </div>
                        <div className="flex justify-between space-x-4 mt-6">
                            <button
                                onClick={() => setActiveStep('payer')}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setActiveStep('review')}
                                disabled={!acceptedTerms}
                                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Review Step */}
                {activeStep === 'review' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Review Details</h2>
                        <div className="border border-gray-300 rounded-md p-4">
                            {/* Display form data for review */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium">Organization Name:</p>
                                    <p>{formData.payer?.organization_name}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Administration Name:</p>
                                    <p>{formData.payer?.admin_name}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Administration Phone:</p>
                                    <p>{formData.payer?.admin_phone}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Administration Email:</p>
                                    <p>{formData.payer?.admin_email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between space-x-4 mt-6">
                            <button
                                onClick={() => setActiveStep('terms')}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                id="btnConfirm"
                                onClick={onSubmitEnrollment}
                                disabled={isDisabled}
                                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
                            >
                                Confirm
                            </button>
                        </div>
                        {confirmmsg && (
                            <div className="text-center mt-4">
                                <p className={`text-sm ${confirmmsg.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
                                    {confirmmsg}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterPage1;
