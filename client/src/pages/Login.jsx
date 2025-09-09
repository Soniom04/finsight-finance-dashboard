import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppProvider';

function Login() {
  // Destructure login, register, and navigate functions from context
  const { login, register, navigate } = useAppContext();

  // Track current form state: either 'login' or 'sign-up'
  const [state, setState] = useState('login');

  // Form input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error message to display to user
  const [error, setError] = useState("");

  // Loading state to prevent double submissions
  const [loading, setLoading] = useState(false);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    setError(""); // Clear previous error
    setLoading(true); // Set loading to true during request

    try {
      if (state === 'sign-up') {
        // Call register function with user data
        await register({ name, email, password });
        setState('login'); // Switch to login view after successful sign-up
      } else {
        // Call login function
        await login({ email, password });
      }
    } catch (err) {
      // Show a user-friendly error message
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {state === "sign-up" ? "Create an Account" : "Welcome Back!"}
          </h1>
          <p className="text-gray-600">
            {state === "sign-up"
              ? "Join FinSight to manage your finances"
              : "Login to continue to FinSight"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name input only for sign-up */}
          {state === "sign-up" && (
            <div className='mb-4'>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder='Full Name'
                required
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
          )}

          {/* Email input */}
          <div className='mb-4'>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder='Email id'
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* Password input */}
          <div className='mb-4'>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder='Password'
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className='w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50'
          >
            {loading ? "Please wait..." : state === "sign-up" ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Switch between Login and Sign Up */}
        <div className='text-center mt-4'>
          <p className="text-gray-600">
            {state === "sign-up" ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => setState(state === "sign-up" ? "login" : "sign-up")}
              className="ml-2 text-indigo-600 hover:underline"
            >
              {state === "sign-up" ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
