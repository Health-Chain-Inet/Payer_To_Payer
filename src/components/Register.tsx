import React from 'react';
import { useForm } from 'react-hook-form';
// import { Upload, CheckCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../config/config.js';

interface LocationState {
    initialStep?: 'organization' | 'administration' | 'review';
    certificationData?: {
        certification: string;
        uploaded: boolean;
    }
}


const StepTimeline: React.FC<{ activeStep: 'organization' | 'administration' | 'review' }> = ({ activeStep }) => {
    return (
        <div className="mb-6">
            <div className="flex items-center justify-between relative">
                {/* Organization Step */}
                <div className="flex-1 text-center">
                    <span className={`block w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center mb-2 ${activeStep === 'organization' ? 'bg-indigo-600 text-white' : 'bg-white border-indigo-600 text-indigo-600'}`}>
                        1
                    </span>
                    Organization Details
                </div>
                {/* Line connecting the steps */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300">
                    <div className={`h-full bg-indigo-600 transition-all ease-in-out duration-300 ${activeStep === 'organization' ? 'w-0' : activeStep === 'administration' ? 'w-1/2' : 'w-full'}`} />
                </div>
                {/* Administration Step */}
                <div className="flex-1 text-center">
                    <span className={`block w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center mb-2 ${activeStep === 'administration' ? 'bg-indigo-600 text-white' : 'bg-white border-indigo-600 text-indigo-600'}`}>
                        2
                    </span>
                    Administration Details
                </div>
                {/* Review Step */}
                <div className="flex-1 text-center">
                    <span className={`block w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center mb-2 ${activeStep === 'review' ? 'bg-indigo-600 text-white' : 'bg-white border-indigo-600 text-indigo-600'}`}>
                        3
                    </span>
                    Review and Confirm
                </div>
            </div>
        </div>
    );
};



const RegisterPage: React.FC = () => {

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const navigate = useNavigate();
    const [uploading, setUploading] = React.useState<boolean>(false);
    const [formData, setFormData] = React.useState<any>({});

    const location = useLocation();
    const locationState = location.state as LocationState;

    const [activeStep, setActiveStep] = React.useState<'organization' | 'administration' | 'review'>(
        locationState?.initialStep || 'organization'
    );

    const onSubmitOrganization = (data: any) => {
        console.log('Organization Details Submitted:', data);
        setFormData((prev) => ({ ...prev, organization: data }));
        setActiveStep('administration'); // Move to administration details step
    };

    const onSubmitAdministration = (data: any) => {
        console.log('Administration Details Submitted:', data);
        setUploading(true);
        setTimeout(() => {
            setUploading(false);
            setFormData((prev) => ({ ...prev, administration: data }));
            setActiveStep('review'); // Move to review step after submission
        });
    };

    const onSubmitEnrollment = async (e: any, data: any) => {
        e.preventDefault();
        console.log('Enrollment Submitted:', data);
        let enrollurl = config.apiUrl + '/enroll/enroll';
        console.log('enrollurl=', enrollurl)
        //navigate('/success');
        let formdata = new URLSearchParams(data.administration).toString();
        console.log('formdata=', formdata)
        await fetch(enrollurl, {
            method: 'POST',
            body: formdata,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
            .then(response => response.json()) // assuming the server returns a JSON response
            .then(data => {
                console.log(data)
                if (data.success == true) {
                    navigate('/success');
                }
                else {
                    alert("User already exists");
                }
            })
            .catch(error => console.error('Error:', error));
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
                {/* Step Timeline */}
                <StepTimeline activeStep={activeStep} />
                {activeStep === 'organization' && (
                    <form onSubmit={handleSubmit(onSubmitOrganization)}>
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Organization Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Organization Name <span className="text-red-500">*</span>
                                    </label>
                                    <input id="payer_name"
                                        {...register('payer_name', {
                                            required: 'Organization Name is required',
                                            pattern: {
                                                value: /^[A-Za-z\s]+$/,
                                                message: 'Organization Name should contain only letters'
                                            },
                                            minLength: {
                                                value: 2,
                                                message: 'Organization Name must be at least 2 characters'
                                            }
                                        })}
                                        type="text"
                                        className="mt-1 block w-full border-gray-300 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.organizationName && (
                                        <p className="text-red-500 text-sm">{errors.organizationName.message}</p>
                                    )}
                                </div>



                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Organization Type
                                    </label>
                                    <select id="payer_type"
                                        {...register('payer_type')}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        defaultValue="Payer"
                                    >
                                        <option value="Payer">Payer</option>
                                        {/* <option value="Provider" disabled>Provider</option> */}
                                        {/* <option value="Vendor" disabled>Vendor</option> */}
                                    </select>
                                </div>


                            </div>

                            {/* Address Details Section */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Address Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                                        <input id="payer_addr_line1"
                                            {...register('payer_addr_line1')}
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>


                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                                        <input id="payer_addr_line2"
                                            {...register('payer_addr_line2', { required: false })}
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>


                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">City (Optional)</label>
                                        <input id="payer_city"
                                            {...register('payer_city')}
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>


                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">State (Optional)</label>
                                        <input id="payer_state"
                                            {...register('payer_state')}
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>


                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Country</label>
                                        <input id="payer_country"
                                            {...register('payer_country')}
                                            type="text"
                                            value="USA"
                                            readOnly
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Zip Code (Optional)</label>
                                        <input id="payer_zip"
                                            {...register('payer_zip', { required: false })}
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>


                                </div>
                            </div>



                            <div className="flex justify-between space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Previous
                                </button>

                                <button
                                    type="submit"
                                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </form>
                )}


                {activeStep === 'administration' && (
                    <form onSubmit={handleSubmit(onSubmitAdministration)}>
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Administration Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Administration Name <span className="text-red-500">*</span>
                                    </label>
                                    <input id="adm_name"
                                        {...register('adm_name', {
                                            required: 'Administration Name is required',
                                            pattern: {
                                                value: /^[A-Za-z\s]+$/,
                                                message: 'Administration Name should contain only letters'
                                            },
                                            minLength: {
                                                value: 3,
                                                message: 'Administration Name must be at least 2 characters'
                                            },
                                            maxLength: {
                                                value: 50,
                                                message: 'Administration Name cannot exceed 50 characters'
                                            }
                                        })}
                                        type="text"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.adminName && (
                                        <p className="text-red-500 text-sm">{errors.adminName.message}</p>
                                    )}
                                </div>




                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Administration Phone <span className="text-red-500">*</span>
                                    </label>
                                    <input id="adm_phone"
                                        {...register('adm_phone', { required: true })}
                                        type="tel"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.adminPhone && (
                                        <p className="text-red-500 text-sm">Administration Phone is required</p>
                                    )}
                                </div>



                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Administration Email <span className="text-red-500">*</span>
                                    </label>
                                    <input id="adm_email"
                                        {...register('adm_email', { required: true })}
                                        type="email"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.adminEmail && (
                                        <p className="text-red-500 text-sm">Administration Email is required</p>
                                    )}
                                </div>



                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Administration Password <span className="text-red-500">*</span>
                                    </label>
                                    <input id="adm_password"
                                        {...register('adm_password', {
                                            required: 'Administration Password is required',
                                            validate: {
                                                startsWithLetter: (value) => /^[a-zA-Z]/.test(value) || 'Password must begin with a letter',
                                                minLength: (value) => value.length >= 8 || 'Password must be at least 8 characters long',
                                                hasUpperCase: (value) => /[A-Z]/.test(value) || 'Password must include 1 uppercase letter',
                                                hasNumber: (value) => /[0-9]/.test(value) || 'Password must include 1 number',
                                                hasSpecialChar: (value) => /[!@#$%^&*]/.test(value) || 'Password must include 1 special character (!@#$%^&*)'
                                            }
                                        })}
                                        type="password"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.adminPassword && (
                                        <p className="text-red-500 text-sm">{errors.adminPassword.message}</p>
                                    )}
                                </div>



                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register('confirmPassword', {
                                            required: 'Please confirm your password',
                                            validate: (value) =>
                                                value === watch('adm_password') || 'Passwords do not match'
                                        })}
                                        type="password"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                                    )}
                                </div>




                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Organization EIN <span className="text-red-500">*</span>
                                    </label>
                                    <input id="org_ein"
                                        {...register('org_ein', { required: true })}
                                        type="text"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.organizationEIN && (
                                        <p className="text-red-500 text-sm">Organization EIN is required</p>
                                    )}
                                </div>



                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Organization Website <span className="text-red-500">*</span>
                                    </label>
                                    <input id="org_website"
                                        {...register('org_website', { required: true })}
                                        type="url"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.organizationWebsite && (
                                        <p className="text-red-500 text-sm">Organization Website is required</p>
                                    )}
                                </div>



                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Terms and Conditions Link (Optional)</label>
                                    <input id="org_terms"
                                        {...register('org_terms')}
                                        type="url"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.termsLink && (
                                        <p className="text-red-500 text-sm">Please enter a valid URL for Terms and Conditions</p>
                                    )}
                                </div>


                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Privacy Policy Link (Optional)</label>
                                    <input id="privacy_policy"
                                        {...register('privacy_policy')}
                                        type="url"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.privacyPolicyLink && (
                                        <p className="text-red-500 text-sm">Invalid URL format for Privacy Policy Link</p>
                                    )}
                                </div>


                            </div>
                            <div className="flex justify-between space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setActiveStep('organization')}
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Previous
                                </button>


                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </form>
                )}


                {activeStep === 'review' && (
                    <div>
                        <h2 className="text-lg w-full text-center bg-[#4f46e5] font-semibold text-black-800 mb-4">Review and Confirm</h2>

                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <h3 className="font-semibold">Organization Details:</h3>
                                <table className="min-w-full border border-gray-300">
                                    <tbody>
                                        {formData.organization?.payer_name && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>Name:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.organization.payer_name}</td>
                                            </tr>
                                        )}
                                        {formData.organization?.payer_type && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>Type:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.organization.payer_type}</td>
                                            </tr>
                                        )}
                                        {formData.organization?.payer_addr_line1 && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>Address Line 1:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.organization.payer_addr_line1}</td>
                                            </tr>
                                        )}
                                        {formData.organization?.payer_addr_line2 && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>Address Line 2:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.organization.payer_addr_line2}</td>
                                            </tr>
                                        )}
                                        {formData.organization?.payer_city && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>City:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.organization.payer_city}</td>
                                            </tr>
                                        )}
                                        {formData.organization?.payer_state && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>State:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.organization.payer_state}</td>
                                            </tr>
                                        )}
                                        {formData.organization?.payer_country && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>Country:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.organization.payer_country}</td>
                                            </tr>
                                        )}
                                        {formData.organization?.payer_zip && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>Zip Code:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.organization.payer_zip}</td>
                                            </tr>
                                        )}
                                        {formData.organization?.certificate?.name && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>Certificate:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.organization.certificate.name}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold">Administration Details:</h3>
                                <table className="min-w-full border border-gray-300">
                                    <tbody>
                                        {formData.administration?.adm_name && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>Name:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.administration.adm_name}</td>
                                            </tr>
                                        )}

                                        {formData.administration?.adm_phone && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>Phone:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.administration.adm_phone}</td>
                                            </tr>
                                        )}

                                        {formData.administration?.adm_email && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>Email:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.administration.adm_email}</td>
                                            </tr>
                                        )}

                                        {formData.administration?.adm_password && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>Password:</strong></td>
                                                <td className="border border-gray-300 p-2">********</td>
                                            </tr>
                                        )}


                                        {formData.administration?.org_ein && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>EIN:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.administration.org_ein}</td>
                                            </tr>
                                        )}
                                        {formData.administration?.org_website && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>Website:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.administration.org_website}</td>
                                            </tr>
                                        )}
                                        {formData.administration?.org_terms && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>Terms Link:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.administration.org_terms}</td>
                                            </tr>
                                        )}
                                        {formData.administration?.privacy_policy && (
                                            <tr>
                                                <td className="border border-gray-300 p-2"><strong>Privacy Policy Link:</strong></td>
                                                <td className="border border-gray-300 p-2">{formData.administration.privacy_policy}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* add a button saying confirm */}

                        <div className="flex justify-between space-x-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setActiveStep('administration')}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    //console.log('Form submitted:', formData);
                                    return onSubmitEnrollment(event, formData);
                                    //navigate('/success');
                                }}
                                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>

                )}
            </div>
        </div>
    );
};

export default RegisterPage;
