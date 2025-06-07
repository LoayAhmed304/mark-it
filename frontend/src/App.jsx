import './App.css';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { LoaderCircle } from 'lucide-react';
import { useAuthStore } from './stores/authStore';

function App() {
  const { authUser, isCheckingAuth } = useAuthStore();
  if (!authUser && isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="size-15 animate-spin" />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <LoginPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
