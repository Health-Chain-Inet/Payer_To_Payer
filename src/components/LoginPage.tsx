import React, { useContext, useState } from 'react';
import Logo from '../../dist/assets/hclogo.png';
import { useNavigate } from 'react-router-dom';
import config from '../config/config.js';
import { GlobalContext } from "./GlobalContext.tsx"

const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loginerror, setLoginError] = useState('');
    const { globalVariable, setGlobalVariable } = useContext<any>(GlobalContext);

    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        username: '',
        password: {
            required: '',
            length: '',
            uppercase: '',
            lowercase: '',
            number: '',
            special: ''
        }
    });



    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            username: '',
            password: {
                required: '',
                length: '',
                uppercase: '',
                lowercase: '',
                number: '',
                special: ''
            }
        };

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password.required = 'Password is required';
            isValid = false;
        } else {
            if (formData.password.length < 8) {
                newErrors.password.length = 'Password must be at least 8 characters';
                isValid = false;
            }
            if (!/[A-Z]/.test(formData.password)) {
                newErrors.password.uppercase = 'Password must contain at least one uppercase letter';
                isValid = false;
            }
            if (!/[a-z]/.test(formData.password)) {
                newErrors.password.lowercase = 'Password must contain at least one lowercase letter';
                isValid = false;
            }
            if (!/[0-9]/.test(formData.password)) {
                newErrors.password.number = 'Password must contain at least one number';
                isValid = false;
            }
            if (!/[!@#$%^&*]/.test(formData.password)) {
                newErrors.password.special = 'Password must contain at least one special character (!@#$%^&*)';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Reset form data
            setFormData({
                username: '',
                password: ''
            });

            const loginurl = config.apiUrl + '/validatelogin';
            const formdata = new URLSearchParams(formData).toString();
            console.log('formdata=', formdata)
            await fetch(loginurl, {
                method: 'POST',
                body: formdata,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
                .then(response => response.json()) // assuming the server returns a JSON response
                .then(data => {
                    console.log(data)
                    if (data.status == 200) {

                        localStorage.setItem('user', data.message.adm_name)
                        localStorage.setItem('email', data.message.adm_email)

                        setGlobalVariable({ user: localStorage.getItem('user'), email: localStorage.getItem('email') })
                        setLoginError("");
                        navigate('/directory');
                    }
                    else {
                        setLoginError("Invalid Username or Password");
                    }

                })
                .catch(error => console.error('Error:', error));


            // Redirect to dashboard
            //navigate('/directory');

        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex h-screen">
            {/* Left Section */}
            <div className="w-1/2 bg-[#004188] flex items-center justify-center">
                <h1 className="text-7xl font-bold text-white">Payer to Payer</h1>
            </div>

            {/* Right Section */}
            <div className="w-1/2 flex items-center justify-center bg-gray-100 p-4">
                <div className="w-full max-w-md shadow-[0_8px_50px_rgb(0,0,0,0.12)]">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="text-center mb-6">
                            <div className="w-40 h-20 rounded-full mx-auto mb-4">
                                <img src={Logo} alt="Health Chain" className="w-full h-full rounded-full" />
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">

                            <div className="relative">
                                <label htmlFor="email" className="flex items-center">
                                    Email
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="username"
                                    placeholder="Email address"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-[#004188] pl-8 ${errors.username ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    required
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                                )}
                            </div>




                            <div className="relative">
                                <label htmlFor="password" className="flex items-center">
                                    Password
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-[#004188] pl-8 ${Object.values(errors.password).some(error => error !== '')
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                        }`}
                                    required
                                />
                                <div className="mt-2 space-y-1">
                                    {Object.entries(errors.password).map(([key, value]) =>
                                        value && (
                                            <p key={key} className="text-red-500 text-xs">{value}</p>
                                        )
                                    )}
                                </div>
                            </div>




                            <div className="space-y-2">
                                
                                
                                <div className="flex flex-col space-y-4">
                                    <div className="flex space-x-4">
                                        <button
                                            type="submit"
                                            className={`flex-1 py-2 rounded transition duration-300 ${isLoading || !formData.username || !formData.password
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-[#004188] hover:bg-[#003166]'
                                                } text-white`}
                                            disabled={isLoading || !formData.username || !formData.password}
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Logging in...
                                                </span>
                                            ) : (
                                                'Login'
                                            )}
                                        </button>




                                        <span className="flex-1 text-center text-gray-600">or</span>
                                        <button
                                            type="button"
                                            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition duration-300"
                                            onClick={() => navigate('/register')}
                                        >
                                            Enroll
                                        </button>
                                    </div>

                                    
                                    {loginerror && (
                                        <div className="text-red-500 text-sm text-center">{loginerror}</div>
                                    )}
                                </div>



                            </div>


                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
