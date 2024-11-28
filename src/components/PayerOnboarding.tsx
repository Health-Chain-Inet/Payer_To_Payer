import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Building2, 
  Upload, 
  Globe, 
  Mail, 
  Phone,
  Shield,
  Save,
  RefreshCw
} from 'lucide-react';

interface OnboardingForm {
  name: string;
  ein: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  technicalContact: {
    name: string;
    email: string;
    phone: string;
  };
  administrativeContact: {
    name: string;
    email: string;
    phone: string;
  };
  privacyOfficer: {
    name: string;
    email: string;
    phone: string;
  };
  endpoints: {
    fhir: string;
    attestation: string;
    bulkData: string;
  };
  certificate: FileList;
  trustFrameworkLevel: 'basic' | 'intermediate' | 'advanced';
}

export default function PayerOnboarding() {
  const { register, handleSubmit, formState: { errors } } = useForm<OnboardingForm>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data: OnboardingForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', data);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Payer Onboarding
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Complete this form to onboard a new payer to the directory
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {/* Organization Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-gray-400" />
              Organization Details
            </h4>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <input
                  type="text"
                  {...register('name', { required: true })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">Name is required</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  EIN
                </label>
                <input
                  type="text"
                  {...register('ein', { required: true, pattern: /^\d{2}-\d{7}$/ })}
                  placeholder="12-3456789"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.ein && (
                  <p className="mt-1 text-sm text-red-600">Valid EIN required (XX-XXXXXXX)</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  {...register('address', { required: true })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    <Globe className="h-4 w-4" />
                  </span>
                  <input
                    type="url"
                    {...register('website', { required: true })}
                    className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    {...register('email', { required: true })}
                    className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    {...register('phone', { required: true })}
                    className="flex-1 block w-full rounded-none rounded-r-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
            {['technicalContact', 'administrativeContact', 'privacyOfficer'].map((contactType) => (
              <div key={contactType} className="mb-6 last:mb-0">
                <h5 className="text-sm font-medium text-gray-700 capitalize mb-3">
                  {contactType.replace(/([A-Z])/g, ' $1')}
                </h5>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      {...register(`${contactType}.name` as any, { required: true })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      {...register(`${contactType}.email` as any, { required: true })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      {...register(`${contactType}.phone` as any, { required: true })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Technical Configuration */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-gray-400" />
              Technical Configuration
            </h4>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trust Framework Level
                </label>
                <select
                  {...register('trustFrameworkLevel', { required: true })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  FHIR Endpoint
                </label>
                <input
                  type="url"
                  {...register('endpoints.fhir', { required: true })}
                  placeholder="https://api.example.com/fhir/r4"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Attestation Endpoint
                </label>
                <input
                  type="url"
                  {...register('endpoints.attestation', { required: true })}
                  placeholder="https://api.example.com/attestation"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bulk Data Endpoint
                </label>
                <input
                  type="url"
                  {...register('endpoints.bulkData', { required: true })}
                  placeholder="https://api.example.com/bulk-data"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Public Certificate (PEM format)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a certificate</span>
                        <input
                          {...register('certificate', { required: true })}
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
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="-ml-1 mr-2 h-5 w-5" />
                  Submit
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}