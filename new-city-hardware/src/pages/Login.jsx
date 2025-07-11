import { useState } from 'react';
import {
  FiUser, FiMail, FiLock, FiEye, FiEyeOff
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import authImage from '../assets/Signup.jpg'; // Ensure image is placed here

export default function Auth() {
  const [isSignup, setIsSignup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-800">
      {/* Left Image */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-slate">
        <div className="p-8">
          <img
            src={authImage}
            alt="Authentication"
            className="w-full h-[85vh] object-cover rounded-2xl shadow-lg"
          />
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 bg-slate-800">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 sm:p-12 w-full max-w-xl text-white border border-white/10">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              {isSignup ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-gray-400">
              {isSignup ? 'Register with:' : 'Sign in with:'}
            </p>
          </div>

          {/* Social Login */}
          <div className="flex justify-center gap-4 mb-6">
            <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition">
              <FcGoogle size={18} /> Google
            </button>
          </div>

          <div className="text-center text-gray-500 text-sm mb-6">or</div>

          {/* Form */}
          <form className="space-y-4">
            {isSignup && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-300">First Name</label>
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                    <FiUser className="text-gray-400 mr-2" />
                    <input type="text" placeholder="First Name" className="bg-transparent focus:outline-none w-full" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-300">Last Name</label>
                  <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                    <FiUser className="text-gray-400 mr-2" />
                    <input type="text" placeholder="Last Name" className="bg-transparent focus:outline-none w-full" />
                  </div>
                </div>
              </div>
            )}

            {isSignup && (
              <div>
                <label className="text-sm text-gray-300">Username</label>
                <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                  <FiUser className="text-gray-400 mr-2" />
                  <input type="text" placeholder="Username" className="bg-transparent focus:outline-none w-full" />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                <FiMail className="text-gray-400 mr-2" />
                <input type="email" placeholder="you@example.com" className="bg-transparent focus:outline-none w-full" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300">Password</label>
              <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2">
                <FiLock className="text-gray-400 mr-2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="bg-transparent focus:outline-none w-full"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 ml-2">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum length is 8 characters.</p>
            </div>

            {/* Submit */}
            <button type="submit" className="w-full bg-yellow-400 text-black font-bold py-2 rounded-xl hover:bg-yellow-300 transition">
              {isSignup ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="text-sm text-center text-gray-400 mt-6">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <button onClick={() => setIsSignup(false)} className="text-yellow-400 hover:underline">
                  Login
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{' '}
                <button onClick={() => setIsSignup(true)} className="text-yellow-400 hover:underline">
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
