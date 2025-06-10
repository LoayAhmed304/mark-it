import React from 'react';
import { useAuthStore } from '../stores/authStore';

const Navbar = () => {
  const { logout } = useAuthStore();
  const handleLogout = async () => {
    logout();
  };
  return (
    <div className="navbar bg-base-200 shadow-sm pl-10 pr-10">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl" href="/">
          Mark It
        </a>
      </div>
      <div className="flex-none">
        <button className="btn btn-dash w-max btn-error" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
};

export default Navbar;
