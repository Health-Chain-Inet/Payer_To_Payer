import React from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';


interface CertificateUploadProps {
  onUpload: (data: FormData) => Promise<void>;
}

export default function CertificateUpload({ onUpload }: CertificateUploadProps) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [uploading, setUploading] = React.useState(false);
  const [certificate, setCertificate] = React.useState('');
  const [msg, setmsg] = React.useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file)
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCertificate(reader.result as string);  // Store the certificate text
        console.log('res=', reader.result)
      };
      reader.readAsText(file);  // Read the file as text
    }
  };

  const onSubmit = async (cdata: any) => {
  
    console.log("cdata=", cdata)
    console.log("certificate read start= ",  cdata.certificate[0])
    setUploading(true);

    try {
      setmsg('uploading.. please wait')
     // await onUpload(formData) ;
      // You can write the URL of your server or any other endpoint used for file upload

      //const formData = new FormData();
      //formData.append('certificate-aaa', cdata.certificate[0]);
      //formData.append('certcontent', "certificatefile"); // Add the custom file name

      const user = localStorage.getItem('user')
      const email = localStorage.getItem('email')
      // console.log('user=', user)
      // console.log('email=', email)

      const postdata = {
        certcontent: {certificate}, 
        user: user, 
        email: email, 
        endpoint: cdata.endpoint
      } 

      const result = await fetch('http://localhost:3001/certificate/uploadcertificate', {
        method: 'POST',
        body: JSON.stringify(postdata),
      });

      console.log('result=', result);
      setmsg('file uploaded')
      setTimeout(()=>{
        setmsg('')
      }, 2500)


    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(false);
  };


  return (
    <div className="bg-white shadow sm:rounded-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
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
                      {...register('certificate', { required: true })}
                      type="file"
                      className="sr-only"
                      accept=".pem,.crt,.cer" 
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PEM, CRT, or CER up to 5MB</p>
              </div>
              {/* <div>
                <h3>PEM File Content:</h3>
                <pre>{certificate}</pre>
              </div> */}
            </div>
          </div>

          {errors.certificate && (
            <div className="flex items-center text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              Certificate is required
            </div>
          )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payer Endpoint URL/ PAYER BASE URL
              </label>
              <input
                type="url"
                {...register('endpoint', { required: true })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="https://api.example.com"
              />
              {errors.endpoint && (
                <p className="mt-2 text-sm text-red-600">Endpoint URL is required</p>
              )}
            </div>

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
        <div>
           {msg}
        </div>
      </form>
    </div>
  );
}