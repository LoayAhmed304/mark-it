import React from 'react';
import { EyeClosed, Eye } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const { login, isLoggingIn } = useAuthStore();

  const handleLogin = (e) => {
    e.preventDefault();
    const status = login(formData);
    if (status === true) {
      setFormData({
        email: '',
        password: '',
      });
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col justify-between md:flex-row h-screen w-full">
      {/* Left Side */}
      <div className="flex justify-center items-center p-10 md:p-16 bg-primary/30 h-full w-full md:w-1/2">
        <div className="flex flex-col items-center justify-center w-full max-w-md">
          <h1 className="text-4xl text-primary font-bold mb-4">
            Welcome Back!
          </h1>
          <p className="text-lg mb-6 text-primary-content">
            Please log in to continue
          </p>
          <form className="flex flex-col gap-4 w-full" onSubmit={handleLogin}>
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
            <button
              type="submit"
              className={
                'btn btn-neutral hover:text-accent p-2 rounded' +
                (isLoggingIn ? ' opacity-40 cursor-not-allowed' : '')
              }
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div>
            <p className="text-base-content text-center mt-4">
              New user?{' '}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="hidden md:flex justify-center items-center bg-secondary h-full w-full md:w-1/2"></div>
    </div>
  );
};

export default LoginPage;
