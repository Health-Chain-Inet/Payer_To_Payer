import React, { useContext, useState, useCallback } from 'react';
import Logo from '../../dist/assets/hclogo.png';
import { useNavigate } from 'react-router-dom';
import config from '../config/config.js';
import { GlobalContext } from "./GlobalContext.tsx";

const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const { setGlobalVariable } = useContext<any>(GlobalContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // Memoize validation functions
    const validatePassword = useCallback((password: string) => {
        const errors = {
            required: '',
            length: '',
            uppercase: '',
            lowercase: '',
            number: '',
            special: ''
        };

        if (!password) {
            errors.required = 'Password is required';
            return errors;
        }

        if (password.length < 8) errors.length = 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(password)) errors.uppercase = 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(password)) errors.lowercase = 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(password)) errors.number = 'Password must contain at least one number';
        if (!/[!@#$%^&*]/.test(password)) errors.special = 'Password must contain at least one special character (!@#$%^&*)';

        return errors;
    }, []);

    const [errors, setErrors] = useState({
        username: '',
        password: validatePassword('')
    });

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Immediate validation feedback
        if (name === 'password') {
            setErrors(prev => ({
                ...prev,
                password: validatePassword(value)
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                [name]: value.length < 3 ? 'Username must be at least 3 characters' : ''
            }));
        }
    }, [validatePassword]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Quick validation check
        const passwordErrors = validatePassword(formData.password);
        const hasPasswordErrors = Object.values(passwordErrors).some(error => error !== '');
        if (!formData.username || hasPasswordErrors) {
            setErrors({
                username: !formData.username ? 'Username is required' : '',
                password: passwordErrors
            });
            return;
        }

        setIsLoading(true);
        setLoginError('');

        try {
            const loginUrl = `${config.apiUrl}/validatelogin`;
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData).toString()
            });

            const data = await response.json();

            if (data.status === 200) {
                localStorage.setItem('user', data.message.adm_name);
                localStorage.setItem('email', data.message.adm_email);

                setGlobalVariable({
                    user: data.message.adm_name,
                    email: data.message.adm_email
                });

                navigate('/directory');
            } else {
                setLoginError('Invalid Username or Password');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setLoginError('An error occurred during login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = formData.username && formData.password &&
        !errors.username &&
        !Object.values(errors.password).some(error => error !== '');

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
                            <div className="w-40 h-20 mx-auto mb-4">
                                <img src={Logo} alt="Health Chain" className="w-full h-full" />
                            </div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="flex items-center">
                                        Email<span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-[#004188] ${errors.username ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Email address"
                                        required
                                    />
                                    {errors.username && (
                                        <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="password" className="flex items-center">
                                        Password<span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:border-[#004188] ${Object.values(errors.password).some(error => error !== '')
                                                ? 'border-red-500'
                                                : 'border-gray-300'
                                            }`}
                                        placeholder="Password"
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
                            </div>

                            <div className="flex flex-col space-y-4">
                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        className={`flex-1 py-2 rounded transition duration-300 ${!isFormValid || isLoading
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-[#004188] hover:bg-[#003166]'
                                            } text-white`}
                                        disabled={!isFormValid || isLoading}
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
                                {loginError && (
                                    <div className="text-red-500 text-sm text-center">{loginError}</div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;