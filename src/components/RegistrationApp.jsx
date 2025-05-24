import React, { useEffect, useState } from 'react';

const RegistrationApp = () => {
  const [currentPage, setCurrentPage] = useState('form');
  const [submittedData, setSubmittedData] = useState(null);

  const navigateToSuccess = (data) => {
    setSubmittedData(data);
    setCurrentPage('success');
  };

  const navigateToForm = () => {
    setCurrentPage('form');
    setSubmittedData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {currentPage === 'form' ? (
        <RegistrationForm onSuccess={navigateToSuccess} />
      ) : (
        <SuccessPage data={submittedData} onBack={navigateToForm} />
      )}
    </div>
  );
};

const RegistrationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    countryCode: '+1',
    phoneNumber: '',
    country: '',
    city: '',
    panNo: '',
    aadharNo: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  // Country and city data
  const countries = [
    'India',
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'Singapore',
    'UAE'
  ];

  const citiesByCountry = {
    'India': ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad'],
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Leeds'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra'],
    'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart'],
    'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes'],
    'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Kobe', 'Nagoya'],
    'Singapore': ['Singapore'],
    'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah']
  };

  const countryCodes = [
    '+1', '+91', '+44', '+61', '+49', '+33', '+81', '+65', '+971'
  ];

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateAadhar = (aadhar) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        return value.trim() ? '' : 'First name is required';
      case 'lastName':
        return value.trim() ? '' : 'Last name is required';
      case 'username':
        return value.trim() ? '' : 'Username is required';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value.trim()) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters long';
        return '';
      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required';
        if (!validatePhone(value)) return 'Please enter a valid 10-digit phone number';
        return '';
      case 'country':
        return value ? '' : 'Country is required';
      case 'city':
        return value ? '' : 'City is required';
      case 'panNo':
        if (!value.trim()) return 'PAN number is required';
        if (!validatePAN(value.toUpperCase())) return 'Please enter a valid PAN number (e.g., ABCDE1234F)';
        return '';
      case 'aadharNo':
        if (!value.trim()) return 'Aadhar number is required';
        if (!validateAadhar(value)) return 'Please enter a valid 12-digit Aadhar number';
        return '';
      default:
        return '';
    }
  };

  // Real-time validation
  useEffect(() => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (touched[key] || formData[key]) {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
  }, [formData, touched]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Reset city when country changes
    if (name === 'country') {
      setFormData(prev => ({
        ...prev,
        city: ''
      }));
      setTouched(prev => ({
        ...prev,
        city: false
      }));
    }
  };

  const handleSubmit = () => {
    // Mark all fields as touched for validation display
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      onSuccess(formData);
    }
  };

  const isFormValid = () => {
    // Check if all required fields are filled
    const requiredFields = ['firstName', 'lastName', 'username', 'email', 'password', 'phoneNumber', 'country', 'city', 'panNo', 'aadharNo'];
    const allFieldsFilled = requiredFields.every(field => formData[field].toString().trim() !== '');
    
    // Check if there are no validation errors
    const noErrors = Object.keys(errors).length === 0;
    
    return allFieldsFilled && noErrors;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Registration Form</h1>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Enter your first name"
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Enter your last name"
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Choose a username"
          />
          {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Enter your email address"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <div className="flex gap-2">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleInputChange}
              className="w-24 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {countryCodes.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Enter 10-digit phone number"
              maxLength="10"
            />
          </div>
          {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !formData.country ? 'bg-gray-100' : ''
              }`}
              disabled={!formData.country}
            >
              <option value="">Select City</option>
              {formData.country && citiesByCountry[formData.country]?.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number *</label>
            <input
              type="text"
              name="panNo"
              value={formData.panNo}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.panNo ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase`}
              placeholder="e.g., ABCDE1234F"
              maxLength="10"
            />
            {errors.panNo && <p className="mt-1 text-sm text-red-600">{errors.panNo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number *</label>
            <input
              type="text"
              name="aadharNo"
              value={formData.aadharNo}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.aadharNo ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Enter 12-digit Aadhar number"
              maxLength="12"
            />
            {errors.aadharNo && <p className="mt-1 text-sm text-red-600">{errors.aadharNo}</p>}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
            isFormValid()
              ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Submit Registration
        </button>
      </div>
    </div>
  );
};

const SuccessPage = ({ data, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-800">Registration Successful!</h1>
        <p className="mt-2 text-gray-600">
          Thank you for registering. Here are your submitted details:
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">First Name</div>
          <div className="mt-1 text-lg text-gray-900">{data.firstName}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">Last Name</div>
          <div className="mt-1 text-lg text-gray-900">{data.lastName}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">Username</div>
          <div className="mt-1 text-lg text-gray-900">{data.username}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">Email</div>
          <div className="mt-1 text-lg text-gray-900">{data.email}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">Phone Number</div>
          <div className="mt-1 text-lg text-gray-900">{data.countryCode} {data.phoneNumber}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">Country</div>
          <div className="mt-1 text-lg text-gray-900">{data.country}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">City</div>
          <div className="mt-1 text-lg text-gray-900">{data.city}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">PAN Number</div>
          <div className="mt-1 text-lg text-gray-900">{data.panNo.toUpperCase()}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">Aadhar Number</div>
          <div className="mt-1 text-lg text-gray-900">{data.aadharNo}</div>
        </div>
      </div>
      
      <button 
        onClick={onBack}
        className="w-full md:w-auto md:px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
      >
        Back to Form
      </button>
    </div>
  );
};

export default RegistrationApp;