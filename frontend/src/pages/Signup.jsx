import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    setGeneralError('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Username
    if (!formData.Username) {
      newErrors.Username = 'Username is required';
    }

    // Validate Email
    if (!formData.Email) {
      newErrors.Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = 'Email is invalid';
    }

    // Validate Password
    if (!formData.Password) {
      newErrors.Password = 'Password is required';
    } else if (formData.Password.length < 8) {
      newErrors.Password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await authService.signup(formData);

      // Redirect to login page on successful signup
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response?.data?.message) {
        if (err.response.data.message.includes('Username')) {
          setErrors({ ...errors, Username: 'Username already exists' });
        } else if (err.response.data.message.includes('Email')) {
          setErrors({ ...errors, Email: 'Email already exists' });
        } else {
          setGeneralError(err.response.data.message);
        }
      } else {
        setGeneralError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border border-amber-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-500">Smart Park</h1>
          <p className="text-gray-600">Car Wash Management System</p>
        </div>

        <h2 className="text-2xl font-bold text-amber-600 mb-6 text-center">Sign Up</h2>

        {generalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="Username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="Username"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.Username ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Choose a username"
            />
            {errors.Username && <p className="text-red-500 text-sm mt-1">{errors.Username}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="Email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.Email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.Email && <p className="text-red-500 text-sm mt-1">{errors.Email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="Password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="Password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                errors.Password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Create a password (min. 8 characters)"
            />
            {errors.Password && <p className="text-red-500 text-sm mt-1">{errors.Password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 text-white py-3 px-4 rounded-md font-medium hover:bg-amber-600 transition-colors shadow-md mt-6"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
