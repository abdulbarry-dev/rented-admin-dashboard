'use client';

import { useState } from 'react';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import TermsModal from '../components/TermsModal';
import PrivacyModal from '../components/PrivacyModal';
import IDCardUpload from '../components/IDCardUpload';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showIDUpload, setShowIDUpload] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    // Show ID upload modal
    setShowIDUpload(true);
  };

  const handleIDUploadComplete = (files: { front: File; back: File }) => {
    // Handle the uploaded files and complete registration
    console.log('Form submitted:', formData);
    console.log('ID Card files:', files);
    
    // Here you would typically:
    // 1. Upload files to server
    // 2. Create user account
    // 3. Redirect to success page or login
    
    alert('Registration successful! ID cards uploaded.');
  };

  return (
    <div className="min-h-screen h-screen bg-[#0a0a0a] text-[#ededed] flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-7xl h-full max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)] lg:max-h-[calc(100vh-3rem)] flex gap-4 lg:gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-1 flex-col gap-4 xl:gap-6 h-full justify-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl xl:text-2xl font-bold">HR Manager</h1>
              <p className="text-xs xl:text-sm text-gray-400">Admin Dashboard</p>
            </div>
          </div>
          
          <div className="space-y-4 xl:space-y-6">
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
              Join Our<br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                HR Platform
              </span>
            </h2>
            <p className="text-gray-400 text-base xl:text-lg leading-relaxed">
              Manage your workforce efficiently with our comprehensive HR management system. 
              Track employees, monitor performance, and streamline your HR processes.
            </p>
            
            <div className="space-y-3 xl:space-y-4 pt-2">
              <div className="flex items-center gap-3 text-gray-300 text-sm xl:text-base">
                <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-500">✓</span>
                </div>
                <span>Real-time employee tracking</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm xl:text-base">
                <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-500">✓</span>
                </div>
                <span>Advanced analytics & reporting</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm xl:text-base">
                <div className="w-7 h-7 xl:w-8 xl:h-8 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-500">✓</span>
                </div>
                <span>Secure & compliant platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex-1 w-full h-full flex flex-col justify-center">
          <div className="bg-[#141414] border border-gray-800 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-xl max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">HR Manager</span>
            </div>

            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                <h2 className="text-xl sm:text-2xl font-bold">Create Account</h2>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Full Name Field */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs sm:text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email & Phone in Grid on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs sm:text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs sm:text-sm font-medium text-gray-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs sm:text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      placeholder="Strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="text-xs sm:text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      placeholder="Re-enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2 sm:gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-0.5 sm:mt-1 w-4 h-4 rounded border-gray-600 bg-[#1a1a1a] text-purple-600 focus:ring-purple-500 focus:ring-offset-0 flex-shrink-0"
                  required
                />
                <label htmlFor="terms" className="text-xs sm:text-sm text-gray-400 leading-tight sm:leading-normal">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-purple-500 hover:text-purple-400 underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded"
                  >
                    Terms & Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-purple-500 hover:text-purple-400 underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-purple-600/20 text-sm sm:text-base"
              >
                Create Account
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Sign In Link */}
              <div className="text-center pt-1 sm:pt-2">
                <p className="text-gray-400 text-xs sm:text-sm">
                  Already have an account?{' '}
                  <Link 
                    href="/pages/login" 
                    className="text-purple-500 hover:text-purple-400 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      <IDCardUpload 
        isOpen={showIDUpload} 
        onClose={() => setShowIDUpload(false)}
        onUploadComplete={handleIDUploadComplete}
      />
    </div>
  );
}
