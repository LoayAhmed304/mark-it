import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { EyeClosed, Eye } from 'lucide-react';
import AnimatedLogo from '../components/AnimatedLogo';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SignupPage = () => {
  const { isSigningUp, signup } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const validateForm = () => {
    if (
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.username.trim() ||
      !formData.confirmPassword.trim()
    ) {
      return toast.error('Please fill in all fields.');
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error('Please enter a valid email address.');
    }
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match.');
    }
    if (formData.username.length < 3) {
      return toast.error('Username must be at least 3 characters long.');
    }
    return true;
  };
  const handleSignup = async (e) => {
    e.preventDefault();

    if (validateForm() === true) {
      const status = await signup(formData);
      if (status) {
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        navigate('/');
      }
    }
  };
  return (
    <div className="flex flex-col justify-between md:flex-row h-screen w-full">
      {/* Left Side */}
      <div className="flex justify-center items-center p-10 md:p-16 bg-primary/30 h-full w-full md:w-1/2">
        <div className="flex flex-col items-center justify-center w-full max-w-md">
          <h1 className="text-4xl text-primary font-bold mb-4">
            Create Account
          </h1>
          <p className="text-lg mb-6 text-primary-content">
            Get started with your free account
          </p>
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Username"
              className="p-2 border rounded w-full"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Email"
              className="p-2 border rounded w-full"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="p-2 border rounded w-full"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </button>
            </div>
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                className="p-2 border rounded w-full"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className={
                'btn btn-neutral hover:text-accent p-2 rounded' +
                (isSigningUp ? ' opacity-40 cursor-not-allowed' : '')
              }
            >
              {isSigningUp ? 'Signing up...' : 'Signup'}
            </button>
          </form>
          <div>
            <p className="text-base-content text-center mt-4">
              Already have an account?{' '}
              <Link to="/login" className="link link-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="hidden md:flex justify-center items-center bg-secondary h-full w-full md:w-1/2">
        <AnimatedLogo />
      </div>
    </div>
  );
};

export default SignupPage;
